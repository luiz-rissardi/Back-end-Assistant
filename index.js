import { GoogleGenerativeAI } from "@google/generative-ai";

// Cria uma instância do cliente da API
const genAI = new GoogleGenerativeAI("AIzaSyCSZBcrAuX2xYMoUoM0e6duPvrjvFvJMyU");

// Obtém o modelo generativo com a configuração desejada
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-exp-0801",
    generationConfig: {
        temperature: 0.0 // Ajuste a temperatura conforme necessário
    }
});

// Histórico de mensagens
let messageHistory = [];

// Função para adicionar uma mensagem ao histórico e obter uma resposta
async function getResponse(userMessage) {
    // Adiciona a mensagem do usuário ao histórico
    messageHistory.push({ role: "user", content: userMessage });
    if(messageHistory.length >= 2){
        messageHistory.shift()
    }

    // Formata o histórico como uma string para o prompt
    const prompt = messageHistory.map(msg => `${msg.role}: ${msg.content}`).join("\n");

    try {
        // Solicita ao modelo uma resposta considerando o histórico
        const result = await model.generateContent(prompt);

        // Adiciona a resposta do modelo ao histórico
        const modelResponse = result.response.text();
        messageHistory.push({ role: "assistant", content: modelResponse });

        return modelResponse;
    } catch (error) {
        console.error('Erro ao gerar resposta:', error);
    }
}

// Exemplo de uso
(async () => {
    console.log(await getResponse("por favor, me dê o link de alguma música do AC/DC"));
    console.log(await getResponse("outra por favor"));
    console.log(await getResponse("que tal agora hells in bells"));
})();


//por favor, me dê o link do youtube da musica 

//me veja alguns links para musicas da banda Gigi D'Agostino no youtube
