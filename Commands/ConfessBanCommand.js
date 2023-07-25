const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const mysql = require('mysql');
const { host, user, password, database } = require('../Jsons/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confessban')
		.setDescription('Ban a user from confessions!')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('Select a user to ban from confessions!')
                  .setRequired(true)),
	async execute(interaction, args, client, prefix) {
        //Database Login
        var pool = mysql.createPool({
            host: host,
            user: user,
            password: password,
            database: database,
            connectionLimit: 100,
        });
        //Database Block
        var sql = `SELECT confession_userbans_ids FROM server_data WHERE server_id = ${interaction.guild.id};`;
        pool.query(sql, async function (err, result) {
            if (err) throw err;
            let confessbans = JSON.stringify(result[0].confession_userbans_ids);
            let bUser = interaction.options.getMember('user');
            if(bUser.id=='1082401009206308945' || bUser.id=='1082402034759766016') return await interaction.reply({content:"\`You can't ban me silly~!\`", ephemeral: true })
            if(confessbans.includes(bUser.id)) return await interaction.reply({ content:`\`This user is already banned from confessions on ${interaction.guild.name}!\``, ephemeral: true })
            if(bUser.permissions.has(PermissionFlagsBits.BanMembers)) return await interaction.reply({ content:"\`I'm unable to ban this person from confessions as they have the ban members permission!`", ephemeral: true });
            //Confess Ban User
            var sql = `UPDATE server_data SET confession_userbans_ids = '${bUser.id + " " + result[0].confession_userbans_ids}' WHERE server_id = ${interaction.guild.id};`;
            pool.query(sql, async function (err, result) {
                    if (err) throw err;
                    let ConfessBanned = new EmbedBuilder()
                    .setTitle(`**Confession: User Banned**`)
                    .setColor("#FF0000")
                    .setDescription(`${bUser} (${bUser.id}) has been banned from using confessions on ${interaction.guild.name}!`)
                    .setFooter({text:`To unban this user, do '${prefix}confessunban'`})
                    await interaction.reply({ embeds: [ConfessBanned], allowedMentions: {repliedUser: false}})   
                    return
        
            });  
        });    
	},
};