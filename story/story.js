const texts = [
    "06월 01일 저녁 6시",
    "비가 세차게 쏟아지던 날이었다...",
    "퇴근길이 길었던 탓일까 발걸음이 무겁게 느껴진다...",
    "무언가 바닥에 반짝이는 것이 보였다...",
    "USB...?"
];

let currentTextIndex = 0;
let isStarEffectActive = false; // 별빛 효과 활성화 여부
const textElement = document.getElementById("text");
const bgm = document.getElementById("bgm");
const crtBgm = document.getElementById("crt-bgm");
const typingSound = document.getElementById("typing-sound");
const introSound = document.getElementById("intro-sound");
const startScreen = document.getElementById("start-screen");
const textContainer = document.getElementById("text-container");
const starEffect = document.getElementById("star-effect");
const crtMonitor = document.getElementById("crt-monitor");

// 배경음악 페이드 인 설정
function fadeInAudio(audio, duration = 2000) {
    audio.volume = 0;
    audio.play();
    let volume = 0;
    const targetVolume = 0.3;
    const interval = 50;
    const step = (targetVolume - volume) / (duration / interval);

    const fadeIn = setInterval(() => {
        volume = Math.min(volume + step, targetVolume);
        audio.volume = volume;
        if (volume >= targetVolume) clearInterval(fadeIn);
    }, interval);
}

// 배경음악 페이드 아웃 설정
function fadeOutAudio(audio, duration = 2000) {
    let volume = audio.volume;
    const interval = 50;
    const step = volume / (duration / interval);

    const fadeOut = setInterval(() => {
        volume = Math.max(volume - step, 0);
        audio.volume = volume;
        if (volume <= 0) {
            clearInterval(fadeOut);
            audio.pause();
            audio.currentTime = 0;
        }
    }, interval);
}

// 텍스트 페이드 아웃 설정
function fadeOutText(element, duration = 2000) {
    let opacity = 1;
    const interval = 50;
    const step = opacity / (duration / interval);

    const fadeOut = setInterval(() => {
        opacity = Math.max(opacity - step, 0);
        element.style.opacity = opacity;
        if (opacity <= 0) {
            clearInterval(fadeOut);
            element.style.display = "none"; // 텍스트 숨기기
        }
    }, interval);
}

document.getElementById("start-button").addEventListener("click", (event) => {
    startScreen.style.display = "none";
    textContainer.style.display = "flex";
    document.body.classList.add("hide-cursor"); // 마우스 커서 숨기기

    introSound.play();
    typeText(texts[currentTextIndex]);
    fadeInAudio(bgm);
    event.stopPropagation();
});

// 텍스트 타이핑 애니메이션 설정
function typeText(text) {
    textElement.textContent = "";
    textElement.classList.remove("typing");
    textElement.style.opacity = 1; // 텍스트 초기화
    void textElement.offsetWidth;
    textElement.classList.add("typing");
    textElement.textContent = text;

    // 타이핑 효과음 재생
    typingSound.pause();
    typingSound.currentTime = 0;
    typingSound.volume = 1;
    typingSound.play();
}

// 애니메이션 종료 시 타이핑 효과음 페이드 아웃
textElement.addEventListener("animationend", () => {
    fadeOutAudio(typingSound, 500); // 0.5초 동안 페이드 아웃
});

// CRT 모니터 표시 및 새로운 배경음악 재생
function showCrtMonitor() {
    crtMonitor.style.display = "flex";
    crtMonitor.classList.add("fade-in");
    document.getElementById("day-indicator").style.display = "block";
    
    crtBgm.loop = true; // 배경음악을 자연스럽게 반복
    fadeInAudio(crtBgm, 2000); // 최초 페이드 인으로 배경음악 시작
}


// USB...?가 표시된 후 클릭 시 페이드 아웃 및 CRT 모니터 표시
function showNextText() {
    if (isStarEffectActive) return;

    typingSound.pause();
    typingSound.currentTime = 0;

    if (texts[currentTextIndex] === "USB...?") {
        fadeOutAudio(bgm, 2000); // 기존 배경음악 페이드 아웃
        fadeOutText(textElement, 2000); // 텍스트 페이드 아웃

        setTimeout(() => {
            showCrtMonitor(); // 2초 후 CRT 모니터 표시 및 새로운 배경음악 페이드 인
        }, 2000);
    } else if (texts[currentTextIndex] === "퇴근길이 길었던 탓일까 발걸음이 무겁게 느껴진다...") {
        currentTextIndex += 1;
        showStarEffect();
    } else {
        currentTextIndex = (currentTextIndex + 1) % texts.length;
        typeText(texts[currentTextIndex]);
    }
}


// 클릭 및 키보드 입력 이벤트 추가
document.addEventListener("click", (event) => {
    if (textContainer.style.display === "flex") {
        showNextText();
    }
});
document.addEventListener("keydown", (event) => {
    if (textContainer.style.display === "flex") {
        showNextText();
    }
});

// 별빛 효과 표시 및 다음 텍스트 설정
function showStarEffect() {
    isStarEffectActive = true;
    textElement.textContent = ""; // 텍스트 숨기기
    starEffect.style.display = "block"; // 별빛 효과 표시
    starEffect.classList.add("sparkle");

    setTimeout(() => {
        starEffect.style.display = "none"; // 3초 후 별빛 효과 숨기기
        isStarEffectActive = false; // 클릭 가능 상태로 복구
        typeText(texts[currentTextIndex]); // 다음 텍스트 타이핑
    }, 3000); // 반짝이는 시간 3초로 조정
}

let isCrtOn = false; // CRT 모니터가 켜진 상태를 추적

const crtOnSound = document.getElementById("crt-on-sound");

// CRT 화면을 켜고, 일정 시간 후 질문을 표시하는 함수
function turnOnCrt() {
    const crtScreen = document.getElementById("crt-screen");
    crtScreen.classList.add("crt-on"); // 화면 켜지는 애니메이션 클래스 추가
    isCrtOn = true; // 상태를 켜진 상태로 변경

    crtOnSound.play(); // CRT 켜짐 효과음 재생
    setTimeout(showPrompt, 2000); // 2초 후에 질문과 버튼 표시
}


// CRT 화면에 질문을 표시하는 함수
function showPrompt() {
    const crtScreen = document.getElementById("crt-screen");
    const promptContainer = document.getElementById("prompt-container");
    crtScreen.style.backgroundColor = "#000"; // CRT 화면을 검은색으로 전환
    promptContainer.style.display = "flex"; // 질문 텍스트와 버튼 표시
    document.body.classList.remove("hide-cursor"); // 마우스 커서 다시 표시
}

// CRT 모니터나 키 입력 시 화면 켜짐
function handleScreenToggle() {
    if (!isCrtOn) {
        turnOnCrt(); // CRT 화면을 켬
    }
}

// YES 버튼 클릭 시 DAY1.html 게임 페이지로 이동
document.getElementById("yes-button").addEventListener("click", () => {
    // DAY1.html로 이동하면서 기존 히스토리를 제거하고, 히스토리 스택을 초기화
    window.location.replace("storymode/day1.html");
});





// 모니터 클릭 시 이벤트
crtMonitor.addEventListener("click", handleScreenToggle);

// 아무 키나 눌러서 모니터를 켜기
document.addEventListener("keydown", handleScreenToggle);
