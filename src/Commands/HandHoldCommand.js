const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('handhold')
		.setDescription('Hold hands with said user')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to hold hands with')
                  .setRequired(true)),
	async execute(interaction) {
        let HoldUser = interaction.options.getMember('user');
        if(HoldUser.id==interaction.member.id) return await interaction.reply({ content: `\`Do you need some affection ${interaction.member.displayName}..?\``, allowedMentions: { repliedUser: false }, ephemeral: true })
        let HoldUserID = HoldUser.id
        const holdgif = new EmbedBuilder()
        fetch(`https://api.waifu.pics/sfw/handhold`)
        .then(res => res.json())
        .then(async json => {
            let image = json.url;
            holdgif.setTitle(`:people_holding_hands:  ${interaction.member.displayName} held ${interaction.guild.members.cache.get(HoldUserID).displayName}'s hand! :people_holding_hands:  `)
            holdgif.setImage(String(image))
            holdgif.setFooter({text:`Requested by ${interaction.member.user.username}`})
            holdgif.setTimestamp()
            await interaction.reply({ embeds: [holdgif], allowedMentions: {repliedUser: true, users: [HoldUserID]}, content: `:people_holding_hands: ${interaction.guild.members.cache.get(HoldUserID)} :people_holding_hands:`})
        });	
	},
};