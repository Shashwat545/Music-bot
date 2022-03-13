//First we import all the dependencies we need
const Discord =require('discord.js');
const {
    prefix,
    token,
} = require('./config.json');
const ytdl = require('ytdl-core');
//Now we create our client and login
const client = new Discord.Client();
client.login(token);
//Next are some basic listeners
client.once('ready', () => {
    console.log('Lessgo!');
});
client.once('reconnecting', () => {
    console.log('Reconnecting!');
});
client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.on('message', async message => {

})

if(message.author.bot) return;

if(!message.content.startsWith(prefix)) return;

