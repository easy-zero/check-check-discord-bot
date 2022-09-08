import { SlashCommandBuilder } from 'discord.js';
import api from '../api/index.js';

const check_in = {
  data: new SlashCommandBuilder()
		.setName('check-in')
		.setDescription('Check-in for users.'),
	async execute(interaction) {
    const channelId = interaction.guild.id;
    const userId = interaction.user.tag;

    try {
      const resp = await api.check_in({ discord_id: userId, discord_channel_id: channelId });
      if (resp.status === 200) {
        await interaction.reply('Check-in succeeded!');
      } else {
        throw new Error();
      }
    } catch (e) {
      console.log(e);
    }
	},
}

export default check_in;