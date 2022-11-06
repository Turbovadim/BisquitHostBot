const { EmbedBuilder, ActionRowBuilder, SlashCommandBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createbutton')
        .setDescription('Создать кнопку тикета')
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#2bf03f')
            .setTitle('Создать тикет')
            .setDescription(`Если у вас возникла проблема или вам нужна помощь
                             Вы можете создать тикет, для этого нажмите на кнопку ниже.
                             Команда поддержки свяжется с вами и постарается Вам помочь.`)
        // const row = new ActionRowBuilder()
        //     .addComponents(
        //         new SelectMenuBuilder()
        //             .setCustomId('question')
        //             .setPlaceholder('Выберите Вопрос')
        //             .addOptions(
        //                 {
        //                     label: 'Не подходит пароль от панели',
        //                     value: 'first_option',
        //                 },
        //                 {
        //                     label: 'Другое',
        //                     value: 'second_option',
        //                 },
        //             ),
        //     );
        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('OpenTicket')
                    .setLabel('Открыть Тикет')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('📩'),
            );

        const channel = interaction.client.channels.cache.get(interaction.channelId);
        await channel.send({components: [row2], embeds: [embed] });
        await interaction.reply({content: "Успешно", ephemeral: true})
    }
}

