import 'dotenv/config';
import { REST, Routes } from 'discord.js';

const commands = [
  {
    name: 'ping',
    description: 'Replies with pong!',
  },
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

// try {
// 	await rest.post(Routes.channelMessages(procoss.env.CHANNEL_ID), {
// 		body: {
// 			content: 'pong',
// 		},
// 	});
// } catch (error) {
// 	console.error(error);
// }
