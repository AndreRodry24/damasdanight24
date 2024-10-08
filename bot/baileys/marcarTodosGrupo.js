export const mencionarTodos = async (c, mensagem) => {
    try {
        const chatId = mensagem.key.remoteJid; // ID do grupo
        const grupoInfo = await c.groupMetadata(chatId); // Obter informações do grupo
        const membros = grupoInfo.participants; // Lista de participantes do grupo

        // ID do autor da mensagem corretamente formatado
        const autorMensagem = mensagem.key.participant; // ID original do autor
        const donoBot = '558596603268@s.whatsapp.net'; // Formato correto do dono do bot

        // Mensagem padrão que o usuário escreveu
        const textoMensagem = mensagem.message.conversation; // Mensagem enviada pelo usuário

        // Logs para verificar os valores
        console.log('Estrutura da mensagem:', JSON.stringify(mensagem, null, 2));
        console.log('ID do autor da mensagem:', autorMensagem);
        console.log('ID do dono do bot:', donoBot);
        console.log('Mensagem recebida:', textoMensagem);

        // Verificar se a mensagem contém #todos
        if (textoMensagem && textoMensagem.endsWith('#todos')) {
            console.log('Comando #todos detectado.');

            // Verificar se quem enviou a mensagem é o dono do bot
            if (autorMensagem === donoBot) {
                console.log('O autor da mensagem é o dono do bot.');

                // Remover a parte #todos da mensagem
                const mensagemSemTodos = textoMensagem.replace(/#todos$/, '').trim();

                // Criar uma mensagem que menciona todos, mas só exibe a mensagem
                const mensagemParaGrupo = {
                    text: mensagemSemTodos, // Mensagem sem menções
                    mentions: membros.map(membro => membro.id) // Mencionar todos os membros
                };

                // Enviar a mensagem para o grupo
                await c.sendMessage(chatId, mensagemParaGrupo);
                console.log('Mensagem enviada para o grupo com sucesso:', mensagemParaGrupo);
            } else {
                console.log('Tentativa de uso do comando por:', autorMensagem);

                // Criar uma mensagem mencionando o usuário que tentou executar o comando
                const mensagemSemPermissao = {
                    text: `@${autorMensagem.split('@')[0]} 🚫 Desculpe, mas apenas o *dono do bot, L🕶️cas⚓*, pode usar este comando. Você *NÃO POSSUI PERMISSÕES* para executá-lo.❌`,
                    mentions: [autorMensagem] // Mencionar a pessoa que tentou usar o comando
                };

                // Enviar a mensagem para o grupo
                await c.sendMessage(chatId, mensagemSemPermissao);
                console.log('Mensagem de permissão enviada para:', autorMensagem);
            }
        }
    } catch (error) {
        console.error('Erro ao mencionar todos:', error);
        console.log('Detalhes da mensagem:', mensagem);
    }
};
