import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Table } from 'embed-table';
import api from '../api/index.js';

const show_my_checkIns = {
  data: new SlashCommandBuilder()
		.setName('show-my-checkins')
		.setDescription('Show a check-in list for a user.'),
	async execute(interaction) {
    const channelId = interaction.guild.id;
    const userId = interaction.user.tag

    try {
      const resp = await api.show_my_checkIns({ discord_channel_id: channelId, discord_id: userId });
      if (resp.data && resp.data.status) {
        if (resp.data.data && resp.data.data.length > 0) {
          const tableData = resp.data.data.map((item, i) => [ `${i+1}`, `${item.check_id_date}` ]);
						const table = new Table({
							titles: ['Check No.', 'Datetime'],
							titleIndexes: [0, 33],
							columnIndexes: [0, 13],
							start: '`',
							end: '`',
							padEnd: 2
						});
						
						tableData.map(item => {
							table.addRow(item);
						});

						const embed = new EmbedBuilder().addFields(table.field());

						interaction.reply({ embeds: [embed] });
          
        } else {
          await interaction.reply("Data is nothing!")
        }
      } else {
        throw new Error();
      }
    } catch (e) {
      console.log(e);
    }
	},
}

export default show_my_checkIns;