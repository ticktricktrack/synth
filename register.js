import 'dotenv/config';
import { REST, Routes } from 'discord.js';

const commands = [
  {
    name: 'ping',
    description: 'Replies with pong!',
  },
  {
    name: 'play',
    description: 'Plays a song from YouTube.',
  }
];

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
