const texts = [
    "06월 05일 저녁 6시",
    "비는 멈춘 것 같지만, 머릿속에서 빗소리가 끊이질 않는다...",
    "익숙한 방이 낯설게 느껴지고, 내 손엔 언제나 USB가 쥐어져 있다.",
    "창밖의 세상이 뒤틀리고, 문득 누군가 내 이름을 부르는 소리가 들린다.",
    "내 이름이 희미해질 때쯤, 화면은 이미 켜져 있다..."
];

let currentTextIndex = 0;
let isStarEffectActive = false; // 별빛 효과 활성화 여부
const day2Text = document.getElementById("day-start-text");
const day2Screen = document.getElementById("day-start-screen");
const textElement = document.getElementById("text");
const bgm = document.getElementById("bgm");
const crtBgm = document.getElementById("crt-bgm");
const typingSound = document.getElementById("typing-sound");
const introSound = document.getElementById("intro-sound");
const startScreen = document.getElementById("start-screen");
const textContainer = document.getElementById("text-container");
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

// 'DAY 2' 텍스트를 키 입력 또는 화면 클릭 시 숨기고 타이핑 시작
function hideDay2Screen() {
    day2Screen.style.display = "none"; // 'DAY 2' 화면 숨기기
    textContainer.style.display = "flex";
    playIntroWithBgm(); // intro-sound와 bgm 재생
    typeText(texts[0]);
}

// 이벤트 리스너 추가: 키 입력 또는 클릭 시 타이핑 시작
window.addEventListener("keydown", hideDay2Screen, { once: true });
window.addEventListener("click", hideDay2Screen, { once: true });

// intro-sound와 bgm 페이드인 재생
function playIntroWithBgm() {
    introSound.play(); // 첫 텍스트에 대한 효과음 재생
    fadeInAudio(bgm, 3000); // 배경음악 페이드 인 설정
}

// 텍스트 타이핑 애니메이션 설정
function typeText(text) {
    textElement.textContent = "";
    textElement.classList.remove("typing");
    textElement.style.opacity = 1;
    document.body.classList.add("hide-cursor"); // Hide cursor during typing
    void textElement.offsetWidth;
    textElement.classList.add("typing");
    textElement.textContent = text;

    // 타이핑 효과음 재생
    typingSound.pause();
    typingSound.currentTime = 0;
    typingSound.volume = 1;
    typingSound.play();
}

// Add event listener to remove cursor-hiding class after typing animation
textElement.addEventListener("animationend", () => {
    fadeOutAudio(typingSound, 500);
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

    if (texts[currentTextIndex] === "내 이름이 희미해질 때쯤, 화면은 이미 켜져 있다...") {
        fadeOutAudio(bgm, 2000); // 기존 배경음악 페이드 아웃
        fadeOutText(textElement, 2000); // 텍스트 페이드 아웃

        setTimeout(() => {
            showCrtMonitor(); // 2초 후 CRT 모니터 표시 및 새로운 배경음악 페이드 인
        }, 2000);
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
    window.location.replace("storymode/DAY5.html");
});

// 모니터 클릭 시 이벤트
crtMonitor.addEventListener("click", handleScreenToggle);

// 아무 키나 눌러서 모니터를 켜기
document.addEventListener("keydown", handleScreenToggle);

// 페이지 로드 시 현재 페이지로 고정하여 뒤로 가기 비활성화
window.addEventListener("load", () => {
    // 현재 페이지를 유일한 히스토리 상태로 설정하여 이전 및 다음 페이지 버튼 비활성화
    history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", () => {
        history.pushState(null, null, window.location.href); // 히스토리 이동 시 다시 현재 페이지로 고정
    });
});

