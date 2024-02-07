const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('admin')
		.setDescription(`Bot Admin Controls`)
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Server Bot Moderation')
                .addStringOption(option =>
                    option.setName('moderation_type')
                        .setDescription('Types of moderation')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Ban', value: 'serverban' },
                            { name: 'Unban', value: 'serverunban' },
                            { name: 'Confession Ban', value: 'serverconfessionban' },
                            { name: 'Confession Unban', value: 'serverconfessionunban' },
                            { name: 'Leave', value: 'serverleave' },
                        ))
                .addStringOption(option =>
                    option
                        .setName('serverid')
                        .setRequired(true)
                        .setDescription('The ID of the server')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('User Bot Moderation')
                .addStringOption(option =>
                    option.setName('moderation_type')
                        .setDescription('Types of moderation')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Bot Ban', value: 'botban' },
                            { name: 'Bot Unban', value: 'botunban' },
                            { name: 'Confession Ban', value: 'confessionban' },
                            { name: 'Confession Unban', value: 'confessionunban' },
                        ))
                .addStringOption(option =>
                    option.setName('id_type')
                        .setDescription('Types of IDs')
                        .setRequired(true)
                        .addChoices(
                            { name: 'User ID', value: 'userchoiceid' },
                            { name: 'Confession ID', value: 'confessionchoiceid' },
                        ))
                .addStringOption(option =>
                    option
                        .setName('choiceid')
                        .setRequired(true)
                        .setDescription('The ID of you previous choice')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('bot')
                .setDescription('Bot Moderation')
                .addStringOption(option =>
                    option.setName('moderation_type')
                        .setDescription('Types of moderation')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Admin Add', value: 'adminadd' },
                            { name: 'Admin Remove', value: 'adminremove' },
                        ))
                .addStringOption(option =>
                    option
                        .setName('userid')
                        .setRequired(true)
                        .setDescription('The ID of the user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('message')
                .setDescription('Message Moderation')
                .addStringOption(option =>
                    option.setName('moderation_type')
                        .setDescription('Types of moderation')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Confession Remove', value: 'confessionremove' },
                        ))
                .addStringOption(option =>
                    option
                        .setName('confessionid')
                        .setRequired(true)
                        .setDescription('The ID of the confession'))),
	async execute(interaction, db, databaseCollections, client) {
        //Database Collections
        let bot_data = databaseCollections.bot_data;
        let confession_data = databaseCollections.confession_data;
        //Command
        const botDocument = await bot_data.find({ type: 'prod' }).toArray();
        const adminArray = botDocument[0].admins || [] 
        let index = adminArray.indexOf(`${interaction.member.user.id}`);
        if (index == -1) return await interaction.reply({content:"I'm sorry, this command can only be ran by the developers and admins of Meii.", ephemeral: true })
        const moderationType = interaction.options.getString('moderation_type');
        if(botDocument[0]==undefined) return interaction.reply({content:`I'm sorry, I cannot find the bot data document.`, ephemeral: true })
        if (interaction.options.getSubcommand() === 'server') {
            //Server
            const givenServerID = interaction.options.getString('serverid');
            const serverObject = client.guilds.cache.get(givenServerID);
            //Ban
            if(moderationType=='serverban'){
                let botBansArray = botDocument[0].server_bans || []
                let index = botBansArray.indexOf(`${givenServerID}`);
                if (index !== -1) return await interaction.reply({ content:`This server is already banned from using Meii.`, ephemeral: true })
                botBansArray.push(`${givenServerID}`)  
                await bot_data.updateOne({ type: `prod` }, { $set: { server_bans: botBansArray } });
                if(serverObject==undefined) return await interaction.reply({content:`The server with the ID of \`${givenServerID}\` is now banned from using Meii.`, ephemeral: true })        
                await serverObject.leave();
                return interaction.reply({content:`\`${serverObject.name} (${serverObject.id})\` is now banned from using Meii.`, ephemeral: true })
            }
            //Unban
            if(moderationType=='serverunban'){
                let botBansArray = botDocument[0].server_bans || []
                let index = botBansArray.indexOf(`${givenServerID}`);
                if (index == -1) return await interaction.reply({ content:`This server isn't banned from using Meii.`, ephemeral: true })
                botBansArray.splice(index, 1);
                await bot_data.updateOne({ type: `prod` }, { $set: { server_bans: botBansArray } });
                if(serverObject==undefined) return interaction.reply({content:`The server with the the ID of \`${givenServerID}\` is now unbanned from using Meii.`, ephemeral: true })
                return interaction.reply({content:`\`${serverObject.name} (${serverObject.id})\` is now unbanned from using Meii.`, ephemeral: true })
            }
            //Confession Ban
            if(moderationType=='serverconfessionban'){
                let confessionBotBansArray = botDocument[0].server_confession_bans || []
                let index = confessionBotBansArray.indexOf(`${givenServerID}`);
                if (index !== -1) return await interaction.reply({ content:`This server is already banned from using confessions.`, ephemeral: true })
                confessionBotBansArray.push(`${givenServerID}`)  
                await bot_data.updateOne({ type: `prod` }, { $set: { server_confession_bans: confessionBotBansArray } });
                if(serverObject==undefined) return await interaction.reply({content:`The server with the ID of \`${givenServerID}\` is now banned from using confessions.`, ephemeral: true })        
                return interaction.reply({content:`\`${serverObject.name} (${serverObject.id})\` is now banned from using confessions.`, ephemeral: true })
            }
            //Confession Unban
            if(moderationType=='serverconfessionunban'){
                let confessionBotBansArray = botDocument[0].server_confession_bans || []
                let index = confessionBotBansArray.indexOf(`${givenServerID}`);
                if (index == -1) return await interaction.reply({ content:`This server isn't banned from using confessions.`, ephemeral: true })
                confessionBotBansArray.splice(index, 1);
                await bot_data.updateOne({ type: `prod` }, { $set: { server_confession_bans: confessionBotBansArray } });
                if(serverObject==undefined) return interaction.reply({content:`The server with the the ID of \`${givenServerID}\` is now unbanned from using confessions.`, ephemeral: true })
                return interaction.reply({content:`\`${serverObject.name} (${serverObject.id})\` is now unbanned from using confessions.`, ephemeral: true })
            }
            //Leave
            if(moderationType=='serverleave'){
                if(serverObject==undefined) return interaction.reply({content:`I cannot find a server with that ID.`, ephemeral: true })
                await serverObject.leave();
                return interaction.reply({content:`Meii has now left \`${serverObject.name} (${serverObject.id})\`.`, ephemeral: false })
            }
        } else if (interaction.options.getSubcommand() === 'user'){ 
            //Check if User or Confession ID
            const moderationType = interaction.options.getString('moderation_type');
            const id_type = interaction.options.getString('id_type');
            const choiceId = interaction.options.getString('choiceid').toUpperCase();
            let givenUserID = undefined;
            //Confession ID
            if(id_type=='confessionchoiceid'){
                //ID Lookup
                const confessionDocument = await confession_data.find({ confession_id: choiceId }).toArray();
                if(confessionDocument[0]==undefined) return interaction.reply({content:`I'm sorry, I cannot find a confession with the ID of **${choiceId}**.`, ephemeral: true })
                //ID Set
                givenUserID = confessionDocument[0].author.id;
            }
            //User ID
            if(id_type=='userchoiceid'){
                givenUserID = choiceId;
            }
            //Bot Ban
            if(moderationType=='botban'){
                let userBansArray = botDocument[0].user_bans || []
                let index = userBansArray.indexOf(`${givenUserID}`);
                if (index !== -1) return await interaction.reply({ content:`This user is already banned from using Meii.`, ephemeral: true })
                userBansArray.push(`${givenUserID}`)  
                await bot_data.updateOne({ type: `prod` }, { $set: { user_bans: userBansArray } });
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now banned from using Meii.`, ephemeral: false })
            }
            //Bot Unban
            if(moderationType=='botunban'){
                let userBansArray = botDocument[0].user_bans || []
                let index = userBansArray.indexOf(`${givenUserID}`);
                if (index == -1) return await interaction.reply({ content:`This user isn't banned from using Meii.`, ephemeral: true })
                userBansArray.splice(index, 1);
                await bot_data.updateOne({ type: `prod` }, { $set: { user_bans: userBansArray } });
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now unbanned from using Meii.`, ephemeral: false })
            }
            //Confession Ban
            if(moderationType=='confessionban'){
                let confessionBansArray = botDocument[0].user_confession_bans || []
                let index = confessionBansArray.indexOf(`${givenUserID}`);
                if (index !== -1) return await interaction.reply({ content:`This user is already banned from using confessions.`, ephemeral: true })
                confessionBansArray.push(`${givenUserID}`)  
                await bot_data.updateOne({ type: `prod` }, { $set: { user_confession_bans: confessionBansArray } });
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now banned from using confessions.`, ephemeral: false })
            }
            //Confession Unban
            if(moderationType=='confessionunban'){
                let confessionBansArray = botDocument[0].user_confession_bans || []
                let index = confessionBansArray.indexOf(`${givenUserID}`);
                if (index == -1) return await interaction.reply({ content:`This user isn't banned from using confessions.`, ephemeral: true })
                confessionBansArray.splice(index, 1);
                await bot_data.updateOne({ type: `prod` }, { $set: { user_confession_bans: confessionBansArray } });
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now unbanned from using confessions.`, ephemeral: false })
            }
        } else if (interaction.options.getSubcommand() === 'bot'){ 
            //Bot
            const givenUserID = interaction.options.getString('userid');
            //Admin Add
            if(moderationType=='adminadd'){
                let adminArray = botDocument[0].admins || []
                let index = adminArray.indexOf(`${givenUserID}`);
                if (index !== -1) return await interaction.reply({ content:`This user is already an admin of Meii.`, ephemeral: true })
                adminArray.push(`${givenUserID}`)  
                await bot_data.updateOne({ type: `prod` }, { $set: { admins: adminArray } });
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now an admin of Meii.`, ephemeral: false })
            }
            //Admin Remove
            if(moderationType=='adminremove'){
                let adminArray = botDocument[0].admins || []
                let index = adminArray.indexOf(`${givenUserID}`);
                if (index == -1) return await interaction.reply({ content:`This user isn't an admin of Meii.`, ephemeral: true })
                adminArray.splice(index, 1);
                await bot_data.updateOne({ type: `prod` }, { $set: { admins: adminArray } });
                return interaction.reply({content:`The user with the ID of \`${givenUserID}\` is now removed as an admin of Meii.`, ephemeral: false })
            }
        } else if (interaction.options.getSubcommand() === 'message'){ 
            //ID Lookup
            const givenConfessionID = interaction.options.getString('confessionid').toUpperCase();
            const confessionDocument = await confession_data.find({ confession_id: givenConfessionID }).toArray();
            if(confessionDocument[0]==undefined) return interaction.reply({content:`I'm sorry, I cannot find a confession with the ID of **${givenConfessionID}**.`, ephemeral: true })
            if(confessionDocument[0].message==undefined) return interaction.reply({content:`I'm sorry, this is a legacy confession that does not have the message info stored.`, ephemeral: true })
            //Message Remove
            if(moderationType=='confessionremove'){
                try{
                    //Check if channel ID is valid
                    try {
                        let storedChannel = await client.channels.fetch(confessionDocument[0].message.channel_id);
                        if (!storedChannel) return interaction.reply({content:`I'm sorry, the channel ID stored isnt valid.`, ephemeral: true })
                    } catch (error) {
                        interaction.reply({content:`I'm sorry, the channel ID thats stored isnt valid.`, ephemeral: true })
                        return;
                    }
                    //Edit Message
                    const storedChannel = await client.channels.fetch(confessionDocument[0].message.channel_id);
                    if (storedChannel.isTextBased()) {
                        //Get Message
                        const confessionMessage = await storedChannel.messages.fetch(confessionDocument[0].message.id);
                        //Editing Message
                        const TOSMessage = "\n__**This confession has been removed for breaking Discord's and or Meii's TOS.**__\n";
                        await confessionMessage.edit({content: `${TOSMessage}`, embeds: []});
                        interaction.reply({content:`The confession with the ID of **${givenConfessionID}** has been successfully edited/removed.`, ephemeral: false })
                        return;
                    } else {
                        //Error for non text channel
                        interaction.reply({content:`I'm sorry, this channel is not a text channel.`, ephemeral: true })
                        return;
                    }
                } catch (error) {
                    //Critical Error Catch
                    interaction.reply({content:`I'm sorry, there has been a error editing this confession.`, ephemeral: true })
                    console.log(error)
                    return;
                }
            }
        }
	},
}; 