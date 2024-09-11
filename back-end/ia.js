// Dataset de treinamento
const trainingData = [
    { command: "jarvis qual o clima ?", label: 0 },     // 0 = clima
    { command: "jarvis como está o tempo ?", label: 0 },
    { command: "jarvis qual a temperatura ?", label: 0 },
    { command: "jarvis como esta o tempo lá fora?", label: 0 },
    { command: "jarvis como esta o tempo ai fora?", label: 0 },
    { command: "jarvis o dia esta bom hoje?", label: 0 },
    { command: "jarvis o dia esta bom para programar hoje ?", label: 0 },
    { command: "jarvis qual é a previsão para hoje ?", label: 0 },

    { command: "jarvis tocar música", label: 1 },     // 1 = música
    { command: "jarvis coloca uma playlist", label: 1 },
    { command: "jarvis quero ouvir música", label: 1 },
    { command: "jarvis tocar musica a thunderstruck", label: 1 },
    { command: "jarvis som na fiaxa jarvis", label: 1 },
    { command: "jarvis som na faixa meu rei", label: 1 },
    { command: "jarvis tocar a banda acdc", label: 1 },
    { command: "jarvis bota minha playlist pra tocar", label: 1 },
    { command: "jarvis bota minha playlist pra tocar", label: 1 },
    { command: "jarvis bota minha playlist pra tocar", label: 1 },
    { command: "jarvis bota minha playlist pra tocar", label: 1 },
    { command: "jarvis bota minha playlist pra tocar", label: 1 },
    { command: "jarvis bota minha playlist pra tocar", label: 1 },

    { command: "jarvis ligar a luz", label: 2 },      // 2 = Luz
    { command: "jarvis acenda a luz", label: 2 },
    { command: "jarvis ativar a luz", label: 2 },
    { command: "jarvis ligar todas as luzes", label: 2 },
    { command: "jarvis acender todas as luzes", label: 2 },
    { command: "jarvis ligar todas as lampadas", label: 2 },

    { command: "jarvis desligar a luz", label: 3 },   // 3 = Desligar Luz
    { command: "jarvis apagar a luz", label: 3 },
    { command: "jarvis desativar a luz", label: 3 },
    { command: "jarvis desligar todas as luzes", label: 3 },
    { command: "jarvis deligar as luzes", label: 3 },
    { command: "jarvis desligar todas as luzes", label: 3 },

];

// Função para converter comandos em vetores numéricos
function encodeCommand(command, maxLength) {
    const charCodes = command.split('').map(char => char.charCodeAt(0) / 255);
    // console.log(maxLength);
    if (maxLength <= 0) {
        throw new Error("maxLength deve ser um número positivo");
    }
    const paddedCharCodes = charCodes.length < maxLength ? 
        charCodes.concat(Array(maxLength - charCodes.length).fill(0)) :
        charCodes.slice(0, maxLength);  // Truncate if too long
    return paddedCharCodes;
}

// Função de ativação sigmoid
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

// Derivada da função sigmoid para ajuste dos pesos
function sigmoidDerivative(x) {
    return x * (1 - x);
}

// Função de perda (Mean Squared Error)
function mse(predicted, actual) {
    let sum = 0;
    for (let i = 0; i < predicted.length; i++) {
        sum += Math.pow(predicted[i] - actual[i], 2);
    }
    return sum / predicted.length;
}

// Inicializar os parâmetros da rede neural
const inputSize = Math.max(...trainingData.map(d => d.command.length));
const hiddenSize = 10;  // Definindo a quantidade de neurônios na camada oculta
const outputSize = 4;  // Agora temos 4 classes diferentes

// Inicialização dos pesos com valores aleatórios
let weightsInputHidden = Array.from({ length: inputSize * hiddenSize }, () => Math.random());
let weightsHiddenOutput = Array.from({ length: hiddenSize * outputSize }, () => Math.random());
let biasHidden = Array.from({ length: hiddenSize }, () => Math.random());
let biasOutput = Array.from({ length: outputSize }, () => Math.random());

// Função para fazer a previsão de uma entrada
function predict(inputVector) {
    // Passo 1: Feedforward
    // Camada Oculta
    let hiddenLayer = [];
    for (let i = 0; i < hiddenSize; i++) {
        let sum = 0;
        for (let j = 0; j < inputSize; j++) {
            sum += inputVector[j] * weightsInputHidden[j + i * inputSize];
        }
        sum += biasHidden[i];
        hiddenLayer[i] = sigmoid(sum);  // Aplicar ativação sigmoid
    }

    // Camada de Saída
    let output = [];
    for (let i = 0; i < outputSize; i++) {
        let sum = 0;
        for (let j = 0; j < hiddenSize; j++) {
            sum += hiddenLayer[j] * weightsHiddenOutput[j + i * hiddenSize];
        }
        sum += biasOutput[i];
        output[i] = sigmoid(sum);  // Aplicar ativação sigmoid para cada saída
    }
    return output;
}

// Função para treinar a rede neural
function train(trainingData, epochs = 200000, learningRate = 0.02) {
    const maxLength = inputSize;  // Tamanho fixo das entradas

    for (let epoch = 0; epoch < epochs; epoch++) {
        let totalLoss = 0;

        trainingData.forEach(data => {
            // Etapa de codificação
            const inputVector = encodeCommand(data.command, maxLength);
            const actual = Array(outputSize).fill(0);  // Inicializa vetor de saída esperada
            actual[data.label] = 1;  // Define a posição correta como 1 para o rótulo do comando

            // Feedforward
            const hiddenLayer = [];
            for (let i = 0; i < hiddenSize; i++) {
                let sum = 0;
                for (let j = 0; j < inputSize; j++) {
                    sum += inputVector[j] * weightsInputHidden[j + i * inputSize];
                }
                sum += biasHidden[i];
                hiddenLayer[i] = sigmoid(sum);
            }

            let output = [];
            for (let i = 0; i < outputSize; i++) {
                let sum = 0;
                for (let j = 0; j < hiddenSize; j++) {
                    sum += hiddenLayer[j] * weightsHiddenOutput[j + i * hiddenSize];
                }
                sum += biasOutput[i];
                output[i] = sigmoid(sum);
            }

            // Backpropagation (ajuste dos pesos)
            const outputError = output.map((pred, idx) => actual[idx] - pred);
            const outputDelta = outputError.map((err, idx) => err * sigmoidDerivative(output[idx]));

            // Ajuste dos pesos da camada de saída
            for (let i = 0; i < outputSize; i++) {
                for (let j = 0; j < hiddenSize; j++) {
                    weightsHiddenOutput[j + i * hiddenSize] += hiddenLayer[j] * outputDelta[i] * learningRate;
                }
                biasOutput[i] += outputDelta[i] * learningRate;
            }

            // Ajuste dos pesos da camada oculta
            for (let i = 0; i < hiddenSize; i++) {
                let hiddenError = 0;
                for (let j = 0; j < outputSize; j++) {
                    hiddenError += outputDelta[j] * weightsHiddenOutput[i + j * hiddenSize];
                }
                const hiddenDelta = hiddenError * sigmoidDerivative(hiddenLayer[i]);
                for (let j = 0; j < inputSize; j++) {
                    weightsInputHidden[j + i * inputSize] += inputVector[j] * hiddenDelta * learningRate;
                }
                biasHidden[i] += hiddenDelta * learningRate;
            }

            // Cálculo da perda total
            totalLoss += mse(output, actual);
        });
    }
}

// Treinando a rede neural
train(trainingData);

// Testando a rede neural com um comando
function classifyCommand(testCommand) {
    const encodedTestCommand = encodeCommand(testCommand, inputSize);
    const prediction = predict(encodedTestCommand);

    // Pega o índice da maior probabilidade prevista
    const predictedLabel = prediction.indexOf(Math.max(...prediction));

    // Retorna o rótulo baseado na previsão
    switch (predictedLabel) {
        case 0: return 'Clima';
        case 1: return 'Música';
        case 2: return 'Luz (Ligar)';
        case 3: return 'Luz (Desligar)';
        default: return 'Comando desconhecido';
    }
}

// Exemplo de teste
const testCommand = "jarvis deligar as luzes";
const testCommand2 = "jarvis som na faixa com thunderstruck";
const result = classifyCommand(testCommand);
const result2 = classifyCommand(testCommand2);
console.log(`O comando "${testCommand}" foi classificado como: ${result}`);
console.log(`O comando "${testCommand2}" foi classificado como: ${result2}`);