// cardsContato.js


// Armazena contagem de cards de contato por usuário
const contatoContador = {};
const advertencias = {};

// Função para verificar cards de contato
export async function verificarCardsDeContato(c, mensagem) {
    const usuarioId = mensagem.key.participant || mensagem.key.remoteJid;
    console.log(`Usuário ID: ${usuarioId}`);

    if (!contatoContador[usuarioId]) {
        contatoContador[usuarioId] = 0;
    }

    let numeroCards = 0;

    // Verifica se a mensagem é realmente um card de contato
    if (mensagem.message?.contactMessage) {
        numeroCards += 1;
        console.log(`Contagem de card único: ${numeroCards}`);
    }

    if (mensagem.message?.contactsArrayMessage) {
        numeroCards += mensagem.message.contactsArrayMessage.contacts.length;
        console.log(`Contagem de múltiplos contatos: ${numeroCards}`);
    }

    // Apenas incrementa o contador se houver cards de contato
    if (numeroCards > 0) {
        contatoContador[usuarioId] += numeroCards;
        console.log(`Contador total para ${usuarioId}: ${contatoContador[usuarioId]}`);
    } else {
        console.log('Nenhum card de contato detectado.');
        return; // Sai da função se não for mensagem de contato
    }

    // Verifica os metadados do grupo para saber se o usuário é administrador
    const groupMetadata = await c.groupMetadata(mensagem.key.remoteJid);
    const isAdmin = groupMetadata.participants.some(participant => participant.id === usuarioId && participant.admin);

    // Se o contador atingir 3 e o usuário não for administrador, procede com a remoção
    if (contatoContador[usuarioId] >= 3 && !isAdmin) {
        try {
            await c.groupParticipantsUpdate(mensagem.key.remoteJid, [usuarioId], 'remove');
            console.log(`Participante ${usuarioId} banido com sucesso.`);

            // Delay opcional
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo

            await c.sendMessage(mensagem.key.remoteJid, { text: 'Usuário banido com sucesso! ✅' });
            console.log(`Mensagem de aviso enviada para ${usuarioId}`);

            await c.deleteMessage(mensagem.key.remoteJid, mensagem.key);
            console.log(`Mensagem de contato removida com sucesso para ${usuarioId}`);
        } catch (error) {
            console.error(`Erro ao banir participante ou enviar mensagem:`, error);
        }

        contatoContador[usuarioId] = 0;
        console.log(`Contador resetado para ${usuarioId}`);
    }
}

// Função para lidar com advertências
async function tratarAdvertencia(c, groupId, userId) {
    // Inicializa advertências se o usuário não tiver
    if (!advertencias[userId]) {
        advertencias[userId] = 0;
    }

    // Incrementa o contador de advertências
    advertencias[userId]++;

    // Verifica se o usuário atingiu o limite de advertências
    if (advertencias[userId] >= 3) {
        // Banir o usuário
        await banUser(c, groupId, userId);
        await sendMessage(c, groupId, `@${userId.split('@')[0]}, *você foi removido do grupo ❌ devido a três advertências anteriores. Por favor, revise as regras para evitar futuras penalizações.*`, userId);
        delete advertencias[userId]; // Reiniciar o contador
    } else {
        await sendMessage(c, groupId, `@${userId.split('@')[0]}, você recebeu sua *ADVERTÊNCIA* ${advertencias[userId]}/3 ⚠️ por ações inadequadas. *Lembre-se: ao atingir três advertências, você será removido do grupo.❌*`, userId);
    }
}

// Função para enviar mensagens
async function sendMessage(c, chatId, message, senderId) {
    await c.sendMessage(chatId, { text: message, mentions: [senderId] });
}

// Função para banir usuário
async function banUser(c, groupId, userId) {
    await c.groupParticipantsUpdate(groupId, [userId], 'remove');
}