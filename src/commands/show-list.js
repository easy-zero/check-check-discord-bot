import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

const show_list = {
  data: new SlashCommandBuilder()
		.setName('show-list')
		.setDescription('Show check-in list for condition count.'),
	async execute(interaction) {
    if (interaction.user.id !== interaction.guild.ownerId) {
      await interaction.reply("Only admin(owner) can use this command!");
      return;
    }

    const modal = new ModalBuilder()
    .setCustomId('conditionCountInput')
    .setTitle('Condition count');

    const countInput = new TextInputBuilder()
    .setCustomId('countInput')
    .setLabel("Enter the condition count. (only number)")
    .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(countInput);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
	},
}

export default show_list;
