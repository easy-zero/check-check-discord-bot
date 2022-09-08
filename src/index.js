import { Client, GatewayIntentBits, Collection, InteractionType, EmbedBuilder } from 'discord.js';
import { create } from 'ipfs-http-client'
import fs from 'fs';
import path from 'path';
import { Table } from 'embed-table';
import config from '../config.json' assert { type: 'json'};
import api from './api/index.js';
import { register, check_in, show_list, show_my_checkIns, issue_certificate } from './commands/index.js';

const __dirname = path.resolve();

const ipfs = create(`${config.ipfs.url}:${config.ipfs.port}`);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commands = [ register, check_in, show_list, show_my_checkIns, issue_certificate ];
commands.map(command => client.commands.set(command.data.name, command));


client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.type !== InteractionType.ModalSubmit) return;

    const channelId = interaction.guild.id;

    switch (interaction.customId) {
        case "addressRegister":
            const address = interaction.fields.getTextInputValue('addressInput');
            const userId = interaction.user.tag;

            try {
                const resp = await api.register({ discord_id: userId, discord_channel_id: channelId, user_address: address });
                if (resp.status === 200) {
                    await interaction.reply({ content: 'Address registration succeeded!' });
                } else {
                    throw new Error();
                }
            } catch (e) {
                console.log(e);
            }
            break;

        case "conditionCountInput":
            const conditionCount = interaction.fields.getTextInputValue('countInput');

            try {
                const resp = await api.show_list({ discord_channel_id: channelId, condition_count: conditionCount });
                if (resp.status === 200) {
                    if (resp.data.data.length === 0) {
                        await interaction.reply("Data is nothing!")
                    } else {
                        const tableData = resp.data.data.map((item, i) => [ `${i+1}`, `${item.discord_id}`, `${item.check_count}` ]);
                        const table = new Table({
                            titles: ['No.', 'DiscordID', 'CheckCount'],
                            titleIndexes: [0, 29, 60],
                            columnIndexes: [0, 11, 36],
                            start: '`',
                            end: '`',
                            padEnd: 3
                        });
                        
                        tableData.map(item => {
                            table.addRow(item, { override: 6 });
                        });

                        const embed = new EmbedBuilder().addFields(table.field());

                        interaction.reply({ embeds: [embed] });
                    }
                } else {
                    throw new Error();
                }
            } catch (e) {
                console.log(e);
            }
            break;
            
        case "certificateIssuer":
            const issueCondition = interaction.fields.getTextInputValue('conditionCountInput');
            const title = interaction.fields.getTextInputValue('titleInput');
            const description = interaction.fields.getTextInputValue('descInput');
            const period = interaction.fields.getTextInputValue('periodInput');
            const imageUrl = interaction.fields.getTextInputValue('imageUrlInput');

            const periodArr = period.split('-');
            const descPeriod = `${periodArr[0]} ~ ${periodArr[1]}`

            try {
                // create metadata & upload to ipfs
                const metadata = {
                    name: title,
                    description: `${description}\n\n${descPeriod}`,
                    image: imageUrl
                }
                
                const metadataJson = JSON.stringify(metadata);
                fs.writeFileSync(path.join(__dirname, '/public/metadata.json'), metadataJson);

                const file = fs.readFileSync(path.join(__dirname, '/public/metadata.json'))
                const ipfsData = await ipfs.add({ path: `${title}_${periodArr[1]}`, content: file });
                const metadataCid = ipfsData.cid.toString();

                const tokenURI = `${config.ipfs.url}:${config.ipfs.webPort}/ipfs/${metadataCid}`;

                const resp = await api.issue_certificate({ discord_channel_id: channelId, condition_count: issueCondition, token_uri: tokenURI });
                if (resp.status === 200) {
                    await interaction.reply({ content: 'Successfully issued NFT Certificate!' });
                } else {
                  throw new Error();
                }
            } catch (e) {
                console.log(e);
            }
            break;
        default:
            return;
    }
});

client.login(config.token);