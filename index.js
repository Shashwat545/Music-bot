//First we import all the dependencies we need
const Discord =require("discord.js");
const {
    prefix,
    token,
} = require("./config.json");
const ytdl = require("ytdl-core");
//Now we create our client and login
const client = new Discord.Client();
client.login(token);

const queue = new Map();
//Next are some basic listeners
client.once("ready", () => {
    console.log("Lessgo!");
});
client.once("reconnecting", () => {
    console.log("Reconnecting!");
});
client.once("disconnect", () => {
    console.log("Disconnect!");
});

client.on("message", async message => {

    if(message.author.bot) return;

    if(!message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

    if(message.content.startsWith(`${prefix}play`)) {
        execute(message, serverQueue);
        return;
    }
    else if(message.content.startsWith(`${prefix}skip`)) {
        skip(message, serverQueue);
        return;
    }
    else if(message.content.startsWith(`${prefix}stop`)) {
        stop(message, serverQueue);
        return;
    }
    else{
        message.channel.send("Oops! You entered an invalid command :(");
    }
});

async function execute(message, serverQueue) {
    const args=message.content.split(" ");

    const voiceChannel=message.member.voice.channel;
    if(!voiceChannel)
        return message.channel.send("You haven't joined a voice channel yet :|");
    const permissions=voiceChannel.permissionsFor(message.client.user);
    if(!permissions.has("SPEAK")||!permissions.has("CONNECT")) {
        return message.channel.send("Give me the permissions to join and speak in the voice channel first :(");
    }

    const songInfo=await ytdl.getInfo(args[1]);
    const song= {
        title:songInfo.videoDetails.title,
        url:songInfo.videoDetails.video_url,
    };

    if(!serverQueue) {
        const queueConstruct={
            textChannel:message.channel,
            voiceChannel:voiceChannel,
            connection:null,
            songs:[],
            volume:5,
            playing:true,
        };
        queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        try {
            var connection=await voiceChannel.join();
            queueConstruct.connection=connection;
            play(message.guild, queueConstruct.songs[0]);
        }
        catch(err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    }
    else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} is added to the queue :)`);
    }
}

function skip(message, serverQueue) {
    if(!message.member.voice.channel)
        return message.channel.send("You need to be in a voice channel first :|");
    if(!serverQueue)
        return message.channel.send("You need to play something first :(");
    serverQueue.connection.dispatcher.end();
}
function stop(message,serverQueue) {
    if(!message.member.voice.channel)
        return message.channel.send("You need to be in a voice channel first :|");
    if(!serverQueue)
        return message.channel.send("You need to play something first :(");
    serverQueue.songs=[];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue=queue.get(guild.id);
    if(!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher=serverQueue.connection.play(ytdl(song.url)).on("finish", ()=> {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    }).on("error", error=>console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume /5);
    serverQueue.textChannel.send(`Playing now: **${song.title}**`);
}

client.login(token);