const path = require('node:path');
const fs = require('node:fs');
const wait = require('node:timers/promises').setTimeout;
const { Client, GatewayIntentBits, ActivityType, Collection, Partials, Events, ChannelType, PermissionFlagsBits, ButtonStyle, ActionRowBuilder, ButtonBuilder,
    EmbedBuilder
} = require('discord.js');
const { token } = require('./config.json');


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers], partials: [Partials.Channel] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client
    .on(Events.InteractionCreate, async interaction => {
        if (!interaction.isCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Возникла ошибка при выполнении команды!', ephemeral: true });
        }
    })
    .on(Events.InteractionCreate, async interaction => {
        if (!interaction.isButton()) return;

            var createdChannel

            const guild = interaction.guild;
            const role = guild.roles.cache.find(role => role.name === "🕕 Тех.Поддержка");
            const role2 = guild.roles.cache.find(role => role.name === "🍋 Испытательный срок");
            const user = interaction.user.username
            const category = interaction.channel.parentId

        if (interaction.customId === "CloseTicket") {
            await interaction.channel.delete()
        }
        if (interaction.customId === "OpenTicket") {
            await interaction.reply({content: 'Тикет создан', ephemeral: true})
            await guild.channels.create({
                name: `ticket-${user}`,
                type: ChannelType.GuildText,
                parent: category,
                permissionOverwrites: [
                    {
                        id: interaction.member,
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.channel.guild.roles.everyone,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: role,
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: role2,
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                ]
            })
                .then(channels => {
                    createdChannel = channels
                });
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('CloseTicket')
                        .setLabel('Закрыть тикет')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒'),
                );
            const embed = new EmbedBuilder()
                .setColor('#f0ed2b')
                .setTitle('Ваш тикет')
                .setDescription(`Это ваш тикет, подробно опишите свою проблему, чтобы мы смогли вам помочь как можно быстрее. \n\n**Если ваша проблема связана непосредственно с вашим сервером, укажите ID сервера, или предоставьте полный лог.**`)
            createdChannel.send({embeds: [embed], components: [row]})
            await createdChannel.send({content: `<@${interaction.user.id}>`})
                .then(async message => {
                    await wait(2000);
                    await message.delete()
                })
        }

    })
    .on('ready', () => {
        console.log(`Запущен как ${client.user.tag}`);
        client.user.setActivity("На развитие Bisquit.Host", { type: ActivityType.Watching });
    })
    // .on(Events.InteractionCreate, async interaction => {
    //     if (!interaction.isSelectMenu()) return;
    //     const selected = interaction.values[0];
    //
    //     var createdChannel
    //
    //     const guild = interaction.guild;
    //     const role = guild.roles.cache.find(role => role.name === "Тех.Поддержка");
    //     const role2 = guild.roles.cache.find(role => role.name === "Испытательный срок");
    //     const user = interaction.user
    //     const category = interaction.channel.parentId
    //
    //     if (selected === "first_option") {
    //         await interaction.reply({content: 'Скоро тут будет полноценный ответ', ephemeral: true})
    //     } else if (selected === "second_option") {
    //         await interaction.reply({content: 'Тикет создан', ephemeral: true})
    //         await guild.channels.create({
    //             name: `ticket-${user}`,
    //             type: ChannelType.GuildText,
    //             parent: category,
    //             permissionOverwrites: [
    //                 {
    //                     id: interaction.member,
    //                     allow: [PermissionFlagsBits.ViewChannel],
    //                 },
    //                 {
    //                     id: interaction.channel.guild.roles.everyone,
    //                     deny: [PermissionFlagsBits.ViewChannel],
    //                 },
    //                 {
    //                     id: role,
    //                     allow: [PermissionFlagsBits.ViewChannel],
    //                 },
    //                 {
    //                     id: role2,
    //                     allow: [PermissionFlagsBits.ViewChannel],
    //                 },
    //             ]
    //         })
    //             .then(channels => {
    //                 createdChannel = channels
    //             });
    //         const row = new ActionRowBuilder()
    //             .addComponents(
    //                 new ButtonBuilder()
    //                     .setCustomId('CloseTicket')
    //                     .setLabel('Закрыть тикет')
    //                     .setStyle(ButtonStyle.Danger)
    //                     .setEmoji('🔒'),
    //             );
    //         const embed = new EmbedBuilder()
    //             .setColor('#f0ed2b')
    //             .setTitle('Ваш тикет')
    //             .setDescription(`Это ваш тикет, подробно опишите свою проблему, чтобы мы смогли вам помочь как можно быстрее. \n\n**Если ваша проблема связана непосредственно с вашим сервером, укажите ID сервера, или предоставьте полный лог.**`)
    //         createdChannel.send({embeds: [embed], components: [row]})
    //         await createdChannel.send({content: `<@${interaction.user.id}>`})
    //             .then(async message => {
    //                 await wait(2000);
    //                 await message.delete()
    //             })
    //     }
    // })

client.login(token);