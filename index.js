import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import { YtdlCore, toPipeableStream } from '@ybd-project/ytdl-core';
import { fetch, ProxyAgent } from 'undici';

import { DisTube } from "distube";
// import { YouTubePlugin } from "@distube/youtube";

const PROXY = new ProxyAgent(process.env.PROXY_URL);
const ytdl = new YtdlCore({
  hl: 'en',
  gl: 'US',
  fetcher: (url, options) => {
    return fetch(url, {
        ...options,
        dispatcher: PROXY,
    })
  }
})

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  if (commandName === 'play') {
    console.log('Playing a song from YouTube.');
    const channel = interaction.member.voice.channel;
    const song = interaction.options.getString("link", true);
    console.log(`Song: ${song}`);

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    })

    const player = createAudioPlayer();
    const stream = await ytdl.download(song, {
      filter: 'audioonly',
      quality: 'highestaudio',
      // poToken: process.env.PO_TOKEN,
      // visitorData: process.env.VISITOR_DATA,
    })
    const pipeableStream = toPipeableStream(stream)
    const resource = createAudioResource(pipeableStream);
    connection.subscribe(player)
    await player.play(resource);
    await interaction.reply('Playing a song from YouTube.');
  }
});

// const distube = new DisTube(client, {
//   plugins: [new YouTubePlugin()],
// });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, message => {
  console.log(`Message: ${message.content}`);
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

//Distube version - runs into bot confirmation issue

// client.on(Events.InteractionCreate, async interaction => {
//   if (!interaction.isCommand()) return;

//   const { commandName } = interaction;

//   if (commandName === 'ping') {
//     await interaction.reply('Pong!');
//   }

//   if (commandName === 'play') {
//     console.log('Playing a song from YouTube.');
//     const voiceChannel = interaction.member.voice.channel;
//     const player = distube.voices
//     const song = interaction.options.getString("link", true);
//     console.log(`Song: ${song}`);

//     player.join(voiceChannel);
//     player.get(interaction).setSelfDeaf(true);

//     await distube.play(voiceChannel, song);
//     await interaction.reply('Playing a song from YouTube.');
//   }
// });

client.login(process.env.BOT_TOKEN);
