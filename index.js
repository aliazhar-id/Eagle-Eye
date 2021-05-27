const { Client, Collection } = require("discord.js");
const { token, nodes } = require("./config");
const { Manager } = require("lavaclient");

const client = new Client();

client.modules = new Collection();
client.music = new Manager(nodes, {
    shards: client.shard ? client.shard.count : 1,
    send(id, packet) {
        const guild = client.guilds.cache.get(id);
        if (guild) return guild.shard.send(packet);
    }
});

["command", "event"].map(h => require(`./structures/${h}`)(client));

client.ws.on("VOICE_SERVER_UPDATE", (pk) => client.music.serverUpdate(pk));
client.ws.on("VOICE_STATE_UPDATE", (pk) => client.music.stateUpdate(pk));

client.login(token);