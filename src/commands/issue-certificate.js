import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

const issue_certificate = {
  data: new SlashCommandBuilder()
		.setName('issue-certificate')
		.setDescription('Issue certificate'),
	async execute(interaction) {
    if (interaction.user.id !== interaction.guild.ownerId) {
      await interaction.reply("Only admin(owner) can use this command!");
      return;
    }

    const modal = new ModalBuilder()
			.setCustomId('certificateIssuer')
			.setTitle('Issuing NFT Certificates');

    const conditionCountInput = new TextInputBuilder()
    .setCustomId('conditionCountInput')
    .setLabel("Condition count")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("ex. 5");

		const titleInput = new TextInputBuilder()
    .setCustomId('titleInput')
    .setLabel("Title")
    .setStyle(TextInputStyle.Short);

    const descInput = new TextInputBuilder()
    .setCustomId('descInput')
    .setLabel("Description")
    .setStyle(TextInputStyle.Paragraph);

    const periodInput = new TextInputBuilder()
    .setCustomId('periodInput')
    .setLabel("Period (Please match the format)")
    .setPlaceholder("YYYYMMDD-YYYYMMDD")
    .setMinLength(17)
    .setMaxLength(17)
    .setStyle(TextInputStyle.Short);

    const imageUrlInput = new TextInputBuilder()
    .setCustomId('imageUrlInput')
    .setLabel("NFT Image URL")
    .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(conditionCountInput);
    const secondActionRow = new ActionRowBuilder().addComponents(titleInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(descInput);
    const fourthActionRow = new ActionRowBuilder().addComponents(periodInput);
    const fifthActionRow = new ActionRowBuilder().addComponents(imageUrlInput);

    modal.addComponents([firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow]);

		await interaction.showModal(modal);
	},
}

export default issue_certificate;