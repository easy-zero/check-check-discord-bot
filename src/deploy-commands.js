import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import config from '../config.json' assert { type: 'json'};
import { register, check_in, show_list, show_my_checkIns, issue_certificate } from './commands/index.js';

const commands = [
  register.data,
  check_in.data,
  show_list.data,
  show_my_checkIns.data,
  issue_certificate.data,
]
  .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(config.token);

rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);