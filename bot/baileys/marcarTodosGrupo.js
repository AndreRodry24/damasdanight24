// marcarTodosGrupo.js

export const mencionarTodos = async (c, mensagem) => {
    try {
        const chatId = mensagem.key.remoteJid; // ID do grupo
        const grupoInfo = await c.groupMetadata(chatId); // Obter informações do grupo
        const membros = grupoInfo.participants; // Lista de participantes do grupo

        // Mensagem padrão que o usuário escreveu
        const textoMensagem = mensagem.message.conversation; // Mensagem enviada pelo usuário

        // Verificar se a mensagem contém #todos
        if (textoMensagem.endsWith('#todos')) {
            // Remover a parte #todos da mensagem
            const mensagemSemTodos = textoMensagem.replace(/#todos$/, '').trim();

            // Criar uma mensagem que menciona todos, mas só exibe a mensagem
            const mensagemParaGrupo = {
                text: mensagemSemTodos, // Mensagem sem menções
                mentions: membros.map(membro => membro.id) // Mencionar todos os membros
            };

            // Enviar a mensagem para o grupo
            await c.sendMessage(chatId, mensagemParaGrupo);
        }
    } catch (error) {
        console.error('Erro ao mencionar todos:', error);
    }
};
