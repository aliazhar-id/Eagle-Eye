const Rest = require("../structures/rest");

module.exports = {
    excute: async (client, message, args) => {
        if (!args.length) return message.reply(`you must provide a song argument.`);

        const { channel } = message.member.voice;
        if (!channel || !channel.joinable)
            return message.reply(`uh, i can't join to your channel >:D`);

        const player = 
        client.music.player.get(message.guild.id) || 
        (await client.music.create(message.guild.id));

        if (player.playing) return message.reply(`song already playing dude >:D`);

        const { tracks } = await Rest.search(args.join(" ").includes("https")
            ? encodeURI(args.join(" "))
            : `scsearch:${encodeURIComponent(args.join(" "))}`
        );

        if (!tracks.length) return message.reply(`nothing was found query.`);

        if (!player._connected) 
            await player.connect,(channel.id, { selfDeaf: true });
    
        if (!player.playing && !player.paused) await player.play(tracks[0].tracks);

        message.channel.send(`Playing Now: ${tracks[0].info.title}`);

        player.on("end", async () =>{
            await client.music.destroy(message.guild.id);

            return message.channel.send(`song has concluded.`);
        })
    },

    help: {
        name: "play",
        aliases: ["p"]
    }
}