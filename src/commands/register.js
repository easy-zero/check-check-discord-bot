import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

const register = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register user address'),
  async execute(interaction) {
    const modal = new ModalBuilder()
    .setCustomId('addressRegister')
    .setTitle('Register wallet address');

    const addressInput = new TextInputBuilder()
    .setCustomId('addressInput')
    .setLabel("What's your wallet address?")
    .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(addressInput);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  },
}

export default register;
