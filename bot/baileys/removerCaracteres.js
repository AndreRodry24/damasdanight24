// removerCaracteres.js

// Função para remover participantes em caso de mensagens longas
export async function removerCaracteres(c, mensagem) {
    // Obtém o texto da mensagem, seja como 'conversation' ou 'extendedTextMessage'
    const textoMensagem = mensagem.message?.conversation || mensagem.message?.extendedTextMessage?.text;

    if (textoMensagem) {
        // Verifica o comprimento total da mensagem
        const comprimentoTotal = textoMensagem.length;

        // Obtém o ID do usuário que enviou a mensagem
        const usuarioId = mensagem.key.participant || mensagem.key.remoteJid;
        const grupoId = mensagem.key.remoteJid;

        // Verifica se o usuário é um administrador no grupo
        const metadata = await c.groupMetadata(grupoId);
        const isAdmin = metadata.participants.some(participant => participant.id === usuarioId && (participant.admin === 'admin' || participant.admin === 'superadmin'));

        // Apenas se o usuário NÃO for administrador
        if (!isAdmin) {
            // Verifica se a mensagem tem mais de 700 caracteres
            if (comprimentoTotal > 950) {
                try {
                    await c.groupParticipantsUpdate(grupoId, [usuarioId], 'remove'); // Remove o usuário
                    await c.sendMessage(grupoId, { text: '✅ Usuário banido por mensagem longa!' }); // Envia mensagem ao grupo
                    console.log(`Usuário ${usuarioId} banido por mensagem longa.`);
                } catch (error) {
                    console.error(`Erro ao remover participante:`, error);
                    await c.sendMessage(grupoId, { text: 'Erro ao tentar banir o usuário. ❌' });
                }
            }
        } else {
            console.log(`Usuário ${usuarioId} é administrador e não será removido.`);
        }
    }
}