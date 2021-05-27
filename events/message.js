const { Message } = require("discord.js");
const { prefix } = require("../config");

module.exports = (client, message) => {
    if (!message.guild || message.author.bot || !message.content.startWith(prefix)) return;

    const [cmd, ...args] = message.content
        .toLowerCase()
        .slice(prefix.length)
        .trim()
        .split(/ +/g);

    const command = client.modules.find(c => c.help.name === cmd || c.help.aliases.includes(cmd)
    );

    if (command) command.excute(client, message, args);
};