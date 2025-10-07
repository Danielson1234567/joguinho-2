// =================================================================
// Variáveis e Configurações Iniciais
// =================================================================

const canvas = document.getElementById('gameCanvas');
// Certifique-se que o seu HTML tem um <canvas id="gameCanvas">
const ctx = canvas.getContext('2d');

const box = 20; // Tamanho de cada bloco (quadrado) do jogo em pixels
const canvasSize = canvas.width / box; // Número de blocos na largura/altura

let snake = [];
snake[0] = { x: 10 * box, y: 10 * box }; // Posição inicial da cabeça (10x10)

let food = generateFood(); // Gera a primeira comida

let d; // Variável para armazenar a direção (direction)

let score = 0;

let game; // Variável para armazenar o intervalo do jogo

// =================================================================
// Funções Principais do Jogo
// =================================================================

// Função que gera a posição aleatória da comida
function generateFood() {
    let foodX = Math.floor(Math.random() * canvasSize) * box;
    let foodY = Math.floor(Math.random() * canvasSize) * box;

    // Garante que a comida não apareça dentro da cobra
    for (let i = 0; i < snake.length; i++) {
        if (foodX === snake[i].x && foodY === snake[i].y) {
            return generateFood(); // Chama a função novamente se a posição for inválida
        }
    }

    return {
        x: foodX,
        y: foodY
    };
}

// Função para desenhar o jogo (chamada a cada atualização)
function draw() {
    // 1. Limpa o canvas e desenha o fundo
    ctx.fillStyle = "#2c3e50"; // Cor do fundo (ex: azul escuro)
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Desenha a cobra
    for (let i = 0; i < snake.length; i++) {
        // Cor da cabeça e do corpo
        ctx.fillStyle = (i == 0) ? "green" : "#00ff00"; // Verde escuro para a cabeça, verde claro para o corpo
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        // Borda dos segmentos (opcional, para visualização de "blocos")
        ctx.strokeStyle = "white";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // 3. Desenha a comida
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // 4. Move a cobra
    // Posição da cabeça antiga
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Verifica a direção e move a cabeça
    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    // 5. Verifica se comeu a comida
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = generateFood(); // Gera nova comida
        // NÃO remove a cauda (a cobra cresce)
    } else {
        // Remove a cauda para simular o movimento
        snake.pop();
    }

    // 6. Cria a nova cabeça
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // 7. Verifica Colisões e Game Over
    if (snakeX < 0 || snakeX > canvas.width - box || snakeY < 0 || snakeY > canvas.height - box || collision(newHead, snake)) {
        clearInterval(game); // Para o loop do jogo
        alert(`Game Over! Sua pontuação final: ${score}`);
        // Você pode recarregar a página para reiniciar
        // location.reload();
        return;
    }

    // Adiciona a nova cabeça na frente do array
    snake.unshift(newHead);

    // 8. Atualiza a pontuação na tela
    document.getElementById('score').innerText = score;
    // Certifique-se que você tem um elemento <span id="score">0</span> no seu HTML
}

// Função de Colisão: verifica se a nova cabeça colidiu com o corpo
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// =================================================================
// Controle de Direção e Início
// =================================================================

document.addEventListener("keydown", directionControl);

// Função que muda a direção baseada na tecla pressionada
function directionControl(event) {
    // Evita a cobra ir na direção oposta à atual (Ex: de RIGHT para LEFT)
    if (event.keyCode == 37 && d != "RIGHT") { // Seta Esquerda
        d = "LEFT";
    } else if (event.keyCode == 38 && d != "DOWN") { // Seta Cima
        d = "UP";
    } else if (event.keyCode == 39 && d != "LEFT") { // Seta Direita
        d = "RIGHT";
    } else if (event.keyCode == 40 && d != "UP") { // Seta Baixo
        d = "DOWN";
    }
}

// Inicia o loop do jogo
// O 100 representa o intervalo em milissegundos (velocidade).
// 100ms = 10 quadros por segundo.
game = setInterval(draw, 100);