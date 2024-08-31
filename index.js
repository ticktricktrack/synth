import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';

import { DisTube } from "distube";
import { YouTubePlugin } from "@distube/youtube";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

const distube = new DisTube(client, {
  plugins: [new YouTubePlugin()],
});

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, message => {
  console.log(`Message: ${message.content}`);
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

client.on(Events.InteractionCreate, async interaction => {
  console.log(interaction);
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  if (commandName === 'play') {
    console.log('Playing a song from YouTube.');
    const voiceChannel = interaction.member.voice.channel;
    const player = distube.voices
    const song = interaction.options.getString("input", true);

    // player.join(voiceChannel);
    // player.get(interaction).setSelfDeaf(true);

    // await distube.play(voiceChannel, song);
    // await interaction.reply('Playing a song from YouTube.');
  }
});

client.login(process.env.BOT_TOKEN);
