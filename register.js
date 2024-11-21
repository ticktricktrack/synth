import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

const pingCommand = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

const playCommand = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Plays a song from YouTube.')
  .addStringOption(option => option.setName('link').setDescription('The youtube link to play.').setRequired(true));
console.log(playCommand.toJSON());

const commands = [
  pingCommand.toJSON(),
  playCommand.toJSON(),
]

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

try {
  await rest.put(
    Routes.applicationGuildCommands(process.env.BOT_ID, process.env.GUILD_ID),
    { body: commands }
  );
    console.log('Successfully registered application commands.');
} catch (error) {
  console.error('Failed to register commands:', error);
}
