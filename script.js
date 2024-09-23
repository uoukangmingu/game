﻿﻿let score = 0;
let currentKeys = [];
let currentDirections = [];
let typingCount = 0;
let typingGoal = 0;
let timeLimit = 1800;
let gameMode = 'keys';
let roundStartTime;
const directions = ['left', 'up', 'right', 'down'];
let usedKeys = [];
let currentMusic = null;

function playMusic(difficulty) {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }

    let musicId;
    switch(difficulty) {
        case 2000:
            musicId = 'easy-music';
            break;
        case 1800:
            musicId = 'normal-music';
            break;
        case 1500:
            musicId = 'hard-music';
            break;
        default:
            musicId = 'easy-music';
    }

    currentMusic = document.getElementById(musicId);
    if (currentMusic) {
        currentMusic.play();
    }
    if (currentMusic) {
        currentMusic.volume = currentVolume;
        currentMusic.play();
    }
}


let currentDifficulty;

function startGame(difficulty) {
    currentDifficulty = difficulty;
    timeLimit = difficulty;
    score = 0;
    document.getElementById('score-value').textContent = score;
    document.getElementById('main-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
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
            playMusic(timeLimit);
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
        
        // 메인 화면 레이아웃 수정
        const mainScreen = document.getElementById('main-screen');
        mainScreen.style.flexDirection = 'column';
        mainScreen.style.justifyContent = 'center';
        mainScreen.style.alignItems = 'center';

        // 난이도 버튼과 리더보드를 감싸는 div 생성
        const buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'difficulty-buttons-container';
        const leaderboardContainer = document.createElement('div');
        leaderboardContainer.id = 'main-leaderboard-container';

        // 기존 요소들을 새 컨테이너로 이동
        buttonsContainer.appendChild(document.getElementById('difficulty-buttons'));
        leaderboardContainer.appendChild(document.getElementById('main-leaderboard'));

        // 메인 화면에 새 컨테이너 추가
        mainScreen.appendChild(buttonsContainer);
        mainScreen.appendChild(leaderboardContainer);
    }, 100);

    const gameOverScreen = document.getElementById('game-over');
    gameOverScreen.style.left = '50%';
    gameOverScreen.style.transform = 'translate(-50%, -50%)';

    updateMainLeaderboard();
}


function updateMainLeaderboard() {
    const mainScoreList = document.getElementById('main-score-list');
    mainScoreList.innerHTML = '';
    const topScores = scores.slice(0, 10);
    topScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${score.name}: ${score.score}`;
        mainScoreList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', updateMainLeaderboard);

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


function hideAllGameModes() {
document.getElementById('keys-display').style.display = 'none';
document.getElementById('directions-display').style.display = 'none';
document.getElementById('point-game').style.display = 'none';
document.getElementById('spin-game').style.display = 'none';
document.getElementById('color-game').style.display = 'none'; 
}




function handleKeyPress(event) {
    if (isGameOver) return;  // 게임 오버 상태면 키 입력 무시

    if (gameMode === 'keys') {
        handleKeysMode(event);
    } else if (gameMode === 'directions') {
        handleDirectionsMode(event);
    } else if (gameMode === 'typing') {
        handleTypingMode(event);
    }
}

function handleKeysMode(event) {
    if (isGameOver) return; 
    const pressedKey = event.key.toUpperCase();
    if (currentKeys.includes(pressedKey)) {
        currentKeys = currentKeys.filter(key => key !== pressedKey);
        if (currentKeys.length === 0) {
            document.getElementById('score-value').textContent = score;
    playClearSound();
            startRound();
        }
    }
}

function handleDirectionsMode(event) {
    if (isGameOver) return; 
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
            document.getElementById('score-value').textContent = score;
    playClearSound();
            startRound();
        }
    } else if (pressedDirection) {
        gameOver();
    }
}

function handleTypingMode(event) {
    if (isGameOver) return; 
    if (event.key === 'Control' || event.code === 'ControlRight') {
        typingCount++;
        document.getElementById('keys-display').textContent = `Ctrl 키를 ${typingGoal - typingCount}번 더 누르세요!`;
        if (typingCount >= typingGoal) {
            document.getElementById('score-value').textContent = score;
    playClearSound();
            startRound();
        }
    }
}

function handlePointingMode(event) {
    if (isGameOver) return; 
    if (event.target.id === 'target') {
        document.getElementById('score-value').textContent = score;
    playClearSound();
        startRound();
    } else {
        gameOver();
    }
}

let isGameOver = false;

function gameOver() {
    isGameOver = true;
    lostSound();
    clearTimeout(window.roundTimer);
    document.getElementById('main-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('final-score').textContent = score;
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
}

function restartGame() {
    setTimeout(() => {
        score = 0;
        gameMode = 'keys';
        document.getElementById('score-value').textContent = score;
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('keys-display').style.display = 'none';
        document.getElementById('directions-display').style.display = 'none';
        document.getElementById('point-game').style.display = 'none';
        document.getElementById('register-score-button').style.display = 'block';
        const mainScreen = document.getElementById('main-screen');
        mainScreen.style.flexDirection = 'row';
        mainScreen.style.justifyContent = 'center';
        mainScreen.style.alignItems = 'center';
        resetTimerBar();
        if (window.roundTimer) {
            clearTimeout(window.roundTimer);
        }
        startGame(currentDifficulty);
    }, 100);
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
    if (isGameOver) return;
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
    document.getElementById('score-value').textContent = score;
    playClearSound();
    startRound();
}

    }
}

const recentModes = [];
const RECENT_MODES_TO_REMEMBER = 3;

function switchGameMode() {
    const modes = ['keys', 'directions', 'typing', 'pointing', 'spin', 'color'];
    const availableModes = modes.filter(mode => !recentModes.includes(mode));
    
    if (availableModes.length === 0) {
        // 모든 모드가 최근에 사용되었다면 가장 오래된 것부터 제거
        recentModes.shift();
    }
    
    gameMode = availableModes[Math.floor(Math.random() * availableModes.length)];
    recentModes.push(gameMode);
    
    if (recentModes.length > RECENT_MODES_TO_REMEMBER) {
        recentModes.shift();
    }
}


function startRound() {
    isGameOver = false; 
    createModeDisplay();
    hideAllGameModes();
    switchGameMode();
    updateGameModeDisplay();
    if (gameMode === 'keys') {
        displayKeys();
    } else if (gameMode === 'directions') {
        displayDirections();
    } else if (gameMode === 'typing') {
        startTypingMode();
    } else if (gameMode === 'color') {
        startColorGameMode();
    } else if (gameMode === 'pointing') {
        startPointingMode();
    } else if (gameMode === 'spin') {
        startSpinMode();
    }
    resetTimerBar();
    roundStartTime = Date.now();
    clearTimeout(window.roundTimer);
    window.roundTimer = setTimeout(gameOver, timeLimit);
    score += difficultyScores[currentDifficulty];
    document.getElementById('score-value').textContent = score;
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
            modeDisplay.textContent = 'Type!';
            break;
        case 'directions':
            modeDisplay.textContent = 'Direction!';
            break;
        case 'typing':
            modeDisplay.textContent = 'Beat!';
            break;
        case 'pointing':
            modeDisplay.textContent = 'Catch!';
            break;
        case 'spin':
            modeDisplay.textContent = 'Spin!';
            break;
        case 'color':
            modeDisplay.textContent = 'Color!';
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
function lostSound() {
    const clearSound = document.getElementById('lost-sound');
    clearSound.currentTime = 0;  // 항상 처음부터 재생
    clearSound.play().catch(error => console.log('효과음 재생 실패:', error));
}

function startColorGameMode() {
    hideAllGameModes();
    gameMode = 'color';
    const colorGame = document.getElementById('color-game');
    colorGame.style.display = 'grid';
    colorGame.innerHTML = ''; // 기존 타일 제거
    createColorTiles();
}


function createColorTiles() {
    const colorGame = document.getElementById('color-game');
    colorGame.innerHTML = '';
    
    const tileSize = Math.floor(150 / 3) - 5; // 150px / 3 - gap
    
    const baseColor = getRandomColor();
    const differentColor = getSlightlyDifferentColor(baseColor);
    const differentTileIndex = Math.floor(Math.random() * 9);
    
    for (let i = 0; i < 9; i++) {
        const tile = document.createElement('div');
        tile.className = 'color-tile';
        tile.style.width = `${tileSize}px`;
        tile.style.height = `${tileSize}px`;
        tile.style.backgroundColor = i === differentTileIndex ? differentColor : baseColor;
        tile.addEventListener('click', () => handleColorTileClick(i === differentTileIndex));
        colorGame.appendChild(tile);
    }
}


function getRandomColor() {
    return `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
}

function getSlightlyDifferentColor(baseColor) {
    const rgb = baseColor.match(/\d+/g).map(Number);
    return `rgb(${rgb[0]+10},${rgb[1]+10},${rgb[2]+10})`;
}

function handleColorTileClick(isCorrect) {
    if (isGameOver) return; 
    if (isCorrect) {
        document.getElementById('score-value').textContent = score;
        playClearSound();
        startRound();
    } else {
        gameOver();
    }
}

document.getElementById('play-button').addEventListener('click', function() {
    hoverSound();
    this.style.display = 'none';
    const difficultyButtons = document.getElementById('difficulty-buttons');
    difficultyButtons.style.display = 'flex';
    difficultyButtons.style.flexDirection = 'row';
    difficultyButtons.style.justifyContent = 'center';
    difficultyButtons.style.gap = '10px';
    
    // 버튼들을 순차적으로 나타나게 하는 애니메이션
    const buttons = difficultyButtons.getElementsByTagName('button');
    Array.from(buttons).forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        setTimeout(() => {
            button.style.transition = 'opacity 0.5s, transform 0.5s';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

function createModeDisplay() {
    if (!document.getElementById('mode-display')) {
        const modeDisplay = document.createElement('div');
        modeDisplay.id = 'mode-display';
        document.body.appendChild(modeDisplay);
    }
}

let scores = JSON.parse(localStorage.getItem('scores')) || [];

document.getElementById('register-score-button').addEventListener('click', registerScore);
document.getElementById('close-leaderboard').addEventListener('click', closeLeaderboard);

function registerScore() {
    const playerName = prompt('이름을 입력하세요:');
    if (playerName) {
        const score = parseInt(document.getElementById('final-score').textContent);
        scores.push({name: playerName, score: score});
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 10);  // 상위 10개 점수만 유지
        localStorage.setItem('scores', JSON.stringify(scores));
        showLeaderboard();
    }
    document.getElementById('register-score-button').style.display = 'none';
}

function showLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    const scoreList = document.getElementById('score-list');
    scoreList.innerHTML = '';
    scores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${score.name}: ${score.score}`;
        scoreList.appendChild(li);
    });
    leaderboard.style.display = 'block';
}

function closeLeaderboard() {
    document.getElementById('leaderboard').style.display = 'none';
}

let difficultyScores = {
    2000: 15,  // 쉬움
    1800: 18, // 보통
    1500: 20  // 어려움
};

function updateScore(difficulty) {
    currentScore += difficultyScores[difficulty];
    document.getElementById('score').textContent = `Score: ${currentScore}`;
}

let currentVolume = 1;

function setVolume(volume) {
    currentVolume = volume;
    if (currentMusic) {
        currentMusic.volume = currentVolume;
    }
    localStorage.setItem('gameVolume', currentVolume);
}

document.getElementById('volumeControl').addEventListener('input', function() {
    setVolume(this.value);
});

// 페이지 로드 시 저장된 볼륨 설정 불러오기
window.addEventListener('load', function() {
    const savedVolume = localStorage.getItem('gameVolume');
    if (savedVolume !== null) {
        currentVolume = parseFloat(savedVolume);
        document.getElementById('volumeControl').value = currentVolume;
    }
});

function playButtonSound() {
    const sound = document.getElementById('buttonSound');
    sound.currentTime = 0;  // 소리를 처음부터 재생
    sound.play();
}

// 모든 버튼에 효과음 추가
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', playButtonSound);
});