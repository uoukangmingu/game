﻿const texts = [
    "06월 03일 저녁 6시",
    "비가 조금 더 차가워졌다... 어제의 빗소리가 들리지 않는다...",
    "분명 어제도 게임을 했던 것 같은데, 기억이 또렷하지 않다...",
    "게임 속에서 보았던 이상한 색감이... 현실로 스며든다.",
    "...기억 저편에서 나는 이 USB를 주웠던 기억이 없었다."
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

    if (texts[currentTextIndex] === "...기억 저편에서 나는 이 USB를 주웠던 기억이 없었다.") {
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
    window.location.replace("storymode/DAY3.html");
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

const noButton = document.getElementById("no-button");
const crtScreen = document.getElementById("crt-screen");

// 버튼의 초기 위치와 이동 방향 설정
let noButtonX = 50; // 초기 x 위치 (% 기준)
let noButtonY = 50; // 초기 y 위치 (% 기준)
let directionX = 1; // x 방향 이동 (-1: 왼쪽, 1: 오른쪽)
let directionY = 1; // y 방향 이동 (-1: 위, 1: 아래)
let mouseX = 0;
let mouseY = 0;

// 마우스 위치 추적
document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// 버튼의 위치와 방향 업데이트
function updateNoButtonPosition() {
    const crtRect = crtScreen.getBoundingClientRect();
    const buttonWidth = noButton.offsetWidth;
    const buttonHeight = noButton.offsetHeight;

    // CRT 화면의 최대 이동 경계 계산
    const maxX = crtRect.width - buttonWidth;
    const maxY = crtRect.height - buttonHeight;

    // CRT 화면 내부에서 버튼 이동
    noButtonX += directionX * 0.3; // 버튼 이동 속도
    noButtonY += directionY * 0.3;

    // 버튼이 화면 경계를 벗어나지 않도록 제한
    if (noButtonX <= 0 || noButtonX >= (maxX / crtRect.width) * 100) {
        directionX *= -1; // x 방향 반전
    }
    if (noButtonY <= 0 || noButtonY >= (maxY / crtRect.height) * 100) {
        directionY *= -1; // y 방향 반전
    }

    // 마우스와 버튼의 거리 계산
    const buttonRect = noButton.getBoundingClientRect();
    const distanceX = mouseX - (buttonRect.left + buttonWidth / 2);
    const distanceY = mouseY - (buttonRect.top + buttonHeight / 2);
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    // 마우스가 일정 거리(100px) 이내로 접근하면 버튼이 반대 방향으로 이동
    const hoverThreshold = 100;
    if (distance < hoverThreshold) {
        directionX = distanceX > 0 ? -1 : 1; // x 방향 설정
        directionY = distanceY > 0 ? -1 : 1; // y 방향 설정
    }

    // 버튼의 위치를 % 단위로 업데이트
    noButton.style.left = `${noButtonX}%`;
    noButton.style.top = `${noButtonY}%`;

    // 다음 프레임 호출
    requestAnimationFrame(updateNoButtonPosition);
}

// 버튼 초기 위치 설정 및 애니메이션 시작
window.addEventListener("DOMContentLoaded", () => {
    noButton.style.position = "absolute";
    noButton.style.left = `${noButtonX}%`;
    noButton.style.top = `${noButtonY}%`;

    // 애니메이션 시작
    requestAnimationFrame(updateNoButtonPosition);
});

