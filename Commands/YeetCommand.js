const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yeet')
		.setDescription('Yeets said person')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to yeet!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
		if(!interaction.guild) return
		if(interaction.content==undefined){
			//Interaction
            var currentDateAndTime = new Date().toLocaleString();
            let YeetUser = interaction.options.getMember('user');
            if(!YeetUser) return interaction.reply({ content: ":no_entry: Can't find that user!", allowedMentions: { repliedUser: true }, ephemeral: true });
            if(YeetUser.user.bot) return interaction.reply({ content: ":no_entry: Please don't yeet the bots-", allowedMentions: { repliedUser: false }, ephemeral: true })
            if(YeetUser.id==interaction.member.id) return interaction.reply({ content: `:no_entry: p-pls- n-no- ${interaction.member.displayName}`, allowedMentions: { repliedUser: false }, ephemeral: true })
            let YeetUserID = YeetUser.id
            const yeetgif = new MessageEmbed()
            got('https://api.waifu.pics/sfw/yeet').then(response => {
            let content = response.body;
            let ContentFilter1 = content.replace(/{"url":"/gi, "")
            let FinalImage = ContentFilter1.replace(/"}/gi, "")
            yeetgif.setTitle(`:smiling_imp: ${interaction.member.displayName} yeeted ${interaction.guild.members.cache.get(YeetUserID).displayName}! :smiling_imp: `)
            yeetgif.setImage(String(FinalImage))
            yeetgif.setFooter(currentDateAndTime)
            interaction.reply({ embeds: [yeetgif], allowedMentions: {repliedUser: true, users: [YeetUserID]}, content: `:smiling_imp: ${interaction.guild.members.cache.get(YeetUserID)} :smiling_imp:`})
            })
            return
		}
	},
};