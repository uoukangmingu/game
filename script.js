let score = 0;
let currentKeys = [];
let currentDirections = [];
let typingCount = 0;
let typingGoal = 0;
const timeLimit = 1800; // 고정된 제한 시간
let gameMode = 'keys'; // 'keys', 'directions', 'typing', 'pointing' 중 하나
let roundStartTime;
const directions = ['left', 'up', 'right', 'down'];
let usedKeys = [];

function getRandomKey() {
    const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let availableKeys = keys.split('').filter(key => !usedKeys.includes(key));
    
    if (availableKeys.length === 0) {
        usedKeys = []; // 모든 키를 사용했다면 초기화
        availableKeys = keys.split('');
    }
    
    const randomKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
    usedKeys.push(randomKey);
    return randomKey;
}

function getRandomDirection() {
    return directions[Math.floor(Math.random() * directions.length)];
}

function displayKeys() {
    currentKeys = [getRandomKey(), getRandomKey()];
    const keyDisplay = document.getElementById('keys-display');
    keyDisplay.textContent = currentKeys.join(' ');
    keyDisplay.classList.remove('shake');
    void keyDisplay.offsetWidth; // 리플로우 강제 발생
    keyDisplay.classList.add('shake');
    document.getElementById('directions-display').style.display = 'none';
    document.getElementById('point-game').style.display = 'none';
    keyDisplay.style.display = 'block';
}

function displayDirections() {
    currentDirections = Array(3).fill().map(() => getRandomDirection());
    const directionsDisplay = document.getElementById('directions-display');
    directionsDisplay.innerHTML = currentDirections.map(dir => 
        `<span class="arrow arrow-${dir}"></span>`
    ).join('');
    document.getElementById('keys-display').style.display = 'none';
    document.getElementById('point-game').style.display = 'none';
    directionsDisplay.style.display = 'block';
}

function startTypingMode() {
    typingCount = 0;
    typingGoal = Math.floor(Math.random() * 12) + 1; // 1에서 12 사이의 랜덤 숫자
    document.getElementById('keys-display').textContent = `Ctrl 키를 ${typingGoal}번 누르세요!`;
    document.getElementById('keys-display').style.display = 'block';
    document.getElementById('directions-display').style.display = 'none';
    document.getElementById('point-game').style.display = 'none';
}

function startPointingMode() {
    document.getElementById('keys-display').style.display = 'none';
    document.getElementById('directions-display').style.display = 'none';
    document.getElementById('point-game').style.display = 'block';
    moveTarget();
}

function moveTarget() {
    const target = document.getElementById('target');
    const gameArea = document.getElementById('point-game');
    const maxX = gameArea.clientWidth - target.clientWidth;
    const maxY = gameArea.clientHeight - target.clientHeight;
    
    target.style.left = Math.random() * maxX + 'px';
    target.style.top = Math.random() * maxY + 'px';
}

function resetTimerBar() {
    const timerBar = document.getElementById('timer-bar');
    timerBar.innerHTML = '<div></div>';
    const timerBarInner = timerBar.firstChild;
    
    timerBarInner.style.animation = 'none';
    void timerBarInner.offsetWidth; // 리플로우 강제 발생
    timerBarInner.style.animation = `timer ${timeLimit/1000}s linear forwards`;
}

function switchGameMode() {
    const modes = ['keys', 'directions', 'typing', 'pointing'];
    gameMode = modes[Math.floor(Math.random() * modes.length)];
}

function hideAllGameModes() {
    document.getElementById('keys-display').style.display = 'none';
    document.getElementById('directions-display').style.display = 'none';
    document.getElementById('point-game').style.display = 'none';
}

function startRound() {
    hideAllGameModes();
    switchGameMode();
    if (gameMode === 'keys') {
        displayKeys();
    } else if (gameMode === 'directions') {
        displayDirections();
    } else if (gameMode === 'typing') {
        startTypingMode();
    } else {
        startPointingMode();
    }
    resetTimerBar();
    roundStartTime = Date.now();
    clearTimeout(window.roundTimer);
    window.roundTimer = setTimeout(gameOver, timeLimit);
}

function handleKeyPress(event) {
    if (gameMode === 'keys') {
        handleKeysMode(event);
    } else if (gameMode === 'directions') {
        handleDirectionsMode(event);
    } else if (gameMode === 'typing') {
        handleTypingMode(event);
    }
}

function handleKeysMode(event) {
    const pressedKey = event.key.toUpperCase();
    if (currentKeys.includes(pressedKey)) {
        currentKeys = currentKeys.filter(key => key !== pressedKey);
        if (currentKeys.length === 0) {
            score++;
            document.getElementById('score-value').textContent = score;
            startRound();
        }
    }
}

function handleDirectionsMode(event) {
    const keyToDirection = {
        'ArrowLeft': 'left',
        'ArrowUp': 'up',
        'ArrowRight': 'right',
        'ArrowDown': 'down'
    };

    const pressedDirection = keyToDirection[event.key];
    if (pressedDirection === currentDirections[0]) {
        currentDirections.shift();
        if (currentDirections.length === 0) {
            score++;
            document.getElementById('score-value').textContent = score;
            startRound();
        }
    } else if (pressedDirection) {
        gameOver();
    }
}

function handleTypingMode(event) {
    if (event.key === 'Control' || event.code === 'ControlRight') {
        typingCount++;
        document.getElementById('keys-display').textContent = `Ctrl 키를 ${typingGoal - typingCount}번 더 누르세요!`;
        if (typingCount >= typingGoal) {
            score++;
            document.getElementById('score-value').textContent = score;
            startRound();
        }
    }
}

function handlePointingMode(event) {
    if (event.target.id === 'target') {
        score++;
        document.getElementById('score-value').textContent = score;
        startRound();
    } else {
        gameOver();
    }
}

function gameOver() {
    clearTimeout(window.roundTimer);
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('final-score').textContent = score;
}

function restartGame() {
    score = 0;
    gameMode = 'keys';
    document.getElementById('score-value').textContent = score;
    document.getElementById('game-container').style.display = 'flex';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('keys-display').style.display = 'block';
    document.getElementById('directions-display').style.display = 'none';
    document.getElementById('point-game').style.display = 'none';
    resetTimerBar();
    startRound();
}

document.addEventListener('keydown', handleKeyPress);
document.getElementById('restart-button').addEventListener('click', restartGame);
document.getElementById('point-game').addEventListener('click', function(event) {
    if (gameMode === 'pointing') {
        handlePointingMode(event);
    }
});

startRound();

document.getElementById('restart-button').addEventListener('mouseenter', function() {
    const audio = new Audio('hover_sound.mp3');  // 호버 사운드 파일 경로
    audio.play();
});
