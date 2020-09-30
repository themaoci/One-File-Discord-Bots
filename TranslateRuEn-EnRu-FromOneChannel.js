/****************************
	Transcriptor v1.0
	Created by TheMaoci ~2020
****************************/
/* Description:
	Allows a bot to translate messages and send embed messages to one specified channel to see translation of those messages.
	Whole script is working live and doesnt require Google API Token
	You can easly change languages in the code below
	PS. Yes i could grab server Id from message but who cares...
*/
const Discord = require('discord.js');
const translate = require('@vitalets/google-translate-api');
const client = new Discord.Client();
const lang_1 = "ru"; // translate from (if enabled 2-Way translate it doesn't matter)
const lang_2 = "en"; // translate to   (if enabled 2-Way translate it doesn't matter)
// server ID just for messages redirection link
const serverID = "";
// channel ID where to look at messages
const channelID = "";
// channel ID where to send embed messages
const whereToSend = "";
// change this to allow translation from russian to english only or in both direction
const TranslateBackAndForth = true;
// silent mode: do not display message created
const silentMode = true;

var channelObject = false;
client.on("ready", () => {
	if(!silentMode)
		console.log("Starting...");
	channelObject = client.channels.get(whereToSend);
    console.log("Transcriptor v1.0 Started!");
});
function testCyrlic(msgText){
	return /[а-яА-ЯЁё]/.test(msgText);
}
function translateFromTo(message, _from, _to){
	translate(message.content, {from: _from, to: _to})
		.then(res => {
			const exampleEmbed = {
				color: 0x0099ff,
				title: message.content,
				url: "https://discord.com/channels/" + serverID + "/" + channelID + "/" + message.id,
				author: {
					name: message.author.username,
					icon_url: 'https://cdn.discordapp.com/avatars/' + message.author.id + "/" + message.author.avatar + ".png"
				},
				description: res.text,
				timestamp: new Date(),
			};
			
			if(channelObject != false){
				if(!silentMode)
					console.log("New message translated at timestamp: " + new Date().getTime() + " by: " + message.author.username + "#" + message.author.tag); // not sure abotu that "tag"
				channelObject.send({ embed: exampleEmbed });
			}
		})
		.catch(err => console.log(err));
}
client.on("message", (message) => {
	if(message.channel.id != channelID) return;
	
	if(TranslateBackAndForth){
		if(testCyrlic(message.content))
			translateFromTo(message, lang_1, lang_2);
		else
			translateFromTo(message, lang_2, lang_1);
	} else {
		translateFromTo(message, lang_1, lang_2);
	}
});

client.login("DISCORD BOT TOKEN");//bot token
