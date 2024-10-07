//boasVindas.js

export const configurarBoasVindas = (socket) => {
    socket.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update;

        if (action === 'add') {
            for (const participant of participants) {
                // Obtendo informações do participante
                const participantInfo = await socket.groupMetadata(id);
                const participantName = participantInfo.participants.find(p => p.id === participant)?.notify || participant.split('@')[0];

                // Criando a mensagem de boas-vindas com menção
                const welcomeMessage = {
                    text: `Bem-vindo(a) ao grupo 👏🍻 *DﾑMﾑS* 💃🔥 *Dﾑ* *NIGӇԵ*💃🎶🍾🍸 @${participantName} ✨🎉 \n Aqui é um espaço de interação e diversão 24 horas! 🕛🔥 Participe das conversas e aproveite bons momentos com a gente! 💃🎶🍾🍸 \n \n Digite *!regras* para saber quais são.`,
                    mentions: [participant] // Aqui você menciona o participante
                };
                
                // Enviando mensagem de boas-vindas
                await socket.sendMessage(id, welcomeMessage);
            }
        }
    });
};