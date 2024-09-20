let score = 0;
let currentKeys = [];
let currentDirections = [];
let typingCount = 0;
let typingGoal = 0;
let timeLimit = 1800; // 기본 제한 시간
let gameMode = 'keys'; // 'keys', 'directions', 'typing', 'pointing' 중 하나
let roundStartTime;
const directions = ['left', 'up', 'right', 'down'];
let usedKeys = [];

function startGame(difficulty) {
    timeLimit = difficulty;
    score = 0;
    document.getElementById('score-value').textContent = score;
    document.getElementById('main-screen').style.display = 'none';
    startCountdown();
}

function startCountdown() {
    document.getElementById('countdown').style.display = 'block';
    let count = 3;
CountdownSound();
    document.getElementById('countdown-number').textContent = count;
    let countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            CountdownSound();
            document.getElementById('countdown-number').textContent = count;
        } else {
            clearInterval(countdownInterval);
            document.getElementById('countdown').style.display = 'none';
            document.getElementById('game-container').style.display = 'flex';
            startRound();
        }
    }, 1000);
}

function resetGame() {
    setTimeout(() => {
    score = 0;
    document.getElementById('score-value').textContent = score;
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('main-screen').style.display = 'flex';
    
    // 난이도 버튼 레이아웃 초기화
    const mainScreen = document.getElementById('main-screen');
    mainScreen.style.flexDirection = 'row';
    mainScreen.style.justifyContent = 'center';
    mainScreen.style.alignItems = 'center';
    }, 100);
}


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
    document.getElementById('directions-display').style.    display = 'none';
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
document.getElementById('keys-display').style.display =     'none';
document.getElementById('directions-display').style.display = 'none';
document.getElementById('point-game').style.display = 'none';
    document.getElementById('spin-game').style.display = 'none'; 
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
    playClearSound();
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
    playClearSound();
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
    playClearSound();
            startRound();
        }
    }
}

function handlePointingMode(event) {
    if (event.target.id === 'target') {
                score++;
        document.getElementById('score-value').textContent = score;
    playClearSound();
        startRound();
    } else {
        gameOver();
    }
}

function gameOver() {
    clearTimeout(window.roundTimer);
    document.getElementById('main-screen').style.display = 'none';
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

document.getElementById('restart-button').addEventListener('mouseenter', function() {
hoverSound();
});

document.querySelectorAll('.difficulty-btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        hoverSound();
    });
    button.addEventListener('click', function() {
        startGame(parseInt(this.dataset.time));
    });
});

document.getElementById('main-menu-button').addEventListener('mouseenter', function() { hoverSound(); });
document.getElementById('main-menu-button').addEventListener('click',  resetGame);

let spinCount = 0;
let requiredSpins = 0;
let lastAngle = 0;
let rotations = 0;

function startSpinMode() {
    hideAllGameModes();
    gameMode = 'spin';
    spinCount = 0;
    requiredSpins = Math.floor(Math.random() * 3) + 3;
    document.getElementById('required-spins').textContent = requiredSpins;
    document.getElementById('current-spins').textContent = spinCount;
    document.getElementById('spin-game').style.display = 'block';
    document.getElementById('keys-display').style.display = 'none';
    document.getElementById('directions-display').style.display = 'none';
    document.getElementById('point-game').style.display = 'none';
}

function handleSpinMode(event) {
    const spinArea = document.getElementById('spin-area');
    const rect = spinArea.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2
    const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    const angleDiff = angle - lastAngle;

    if (angleDiff > Math.PI) {
        rotations--;
    } else if (angleDiff < -Math.PI) {
        rotations++;
    }

    lastAngle = angle;

    if (Math.abs(rotations) >= 1) {
        spinCount++;
        document.getElementById('current-spins').textContent = spinCount;
        rotations = 0;

if (spinCount >= requiredSpins) {
    score++;
    document.getElementById('score-value').textContent = score;
    playClearSound();
    startRound();
}

    }
}

function switchGameMode() {
    const modes = ['keys', 'directions', 'typing', 'pointing', 'spin'];
    gameMode = modes[Math.floor(Math.random() * modes.length)];
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
    } else if (gameMode === 'pointing') {
        startPointingMode();
    } else if (gameMode === 'spin') {
        startSpinMode();
    }
    resetTimerBar();
    roundStartTime = Date.now();
    clearTimeout(window.roundTimer);
    window.roundTimer = setTimeout(gameOver, timeLimit);
}

document.getElementById('spin-area').addEventListener('mousemove', function(event) {
    if (gameMode === 'spin') {
        handleSpinMode(event);
    }
});

function displayGameMode() {
    const modeDisplay = document.createElement('div');
    modeDisplay.id = 'mode-display';
    modeDisplay.style.position = 'absolute';
     modeDisplay.style.top = '10px';
    modeDisplay.style.left = '50%';
    modeDisplay.style.transform = 'translateX(-50%)';
    modeDisplay.style.padding = '5px 10px';
    modeDisplay.style.backgroundColor = 'var(--retro-dark-green)';
    modeDisplay.style.color = 'var(--retro-beige)';
    modeDisplay.style.border = '2px solid var(--retro-black)';
    modeDisplay.style.fontFamily = "'Press Start 2P', cursive";
    modeDisplay.style.fontSize = '14px';
    document.body.appendChild(modeDisplay);
}

function updateGameModeDisplay() {
    const modeDisplay = document.getElementById('mode-display');
    switch(gameMode) {
        case 'keys':
            modeDisplay.textContent = '키 모드';
            break;
        case 'directions':
            modeDisplay.textContent = '방향 모드';
            break;
        case 'typing':
            modeDisplay.textContent = '타이핑 모드';
            break;
        case 'pointing':
            modeDisplay.textContent = '포인팅 모드';
            break;
        case 'spin':
            modeDisplay.textContent = '스핀 모드';
            break;
    }
}
function playClearSound() {
    const clearSound = document.getElementById('clear-sound');
    clearSound.currentTime = 0;  // 항상 처음부터 재생
    clearSound.play().catch(error => console.log('효과음 재생 실패:', error));
}
function hoverSound() {
    const clearSound = document.getElementById('hover-sound');
    clearSound.currentTime = 0;  // 항상 처음부터 재생
    clearSound.play().catch(error => console.log('효과음 재생 실패:', error));
}
function CountdownSound() {
    const clearSound = document.getElementById('countdown-sound');
    clearSound.currentTime = 0;  // 항상 처음부터 재생
    clearSound.play().catch(error => console.log('효과음 재생 실패:', error));
}
