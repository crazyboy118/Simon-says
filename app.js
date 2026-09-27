let gameSeq = [];
let userSeq = [];

let btns = ["yellow", "red", "purple", "green"];

let started = false; 
let level = 0;

let h2 = document.querySelector("h2");


const audioContext = new (window.AudioContext || window.webkitAudioContext)();


let backgroundOscillator = null;
let backgroundGain = null;
let isBackgroundPlaying = false;


function playBeep(frequency = 400, duration = 150) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.value = frequency;
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + duration / 1000);
}

function playButtonSound(btnColor) {
    const frequencies = {
        yellow: 523.25,   
        red: 659.25,      
        purple: 783.99,   
        green: 1046.50    
    };
    
    playBeep(frequencies[btnColor] || 400, 200);
}


function startBackgroundMusic() {
    if (isBackgroundPlaying) return;
    
    backgroundOscillator = audioContext.createOscillator();
    backgroundGain = audioContext.createGain();
    
    backgroundOscillator.connect(backgroundGain);
    backgroundGain.connect(audioContext.destination);
    
    backgroundOscillator.frequency.value = 220; 
    backgroundOscillator.type = 'sine';
    
    backgroundGain.gain.setValueAtTime(0.05, audioContext.currentTime);
    
    backgroundOscillator.start();
    isBackgroundPlaying = true;
}


function stopBackgroundMusic() {
    if (backgroundOscillator && isBackgroundPlaying) {
        backgroundOscillator.stop();
        isBackgroundPlaying = false;
        backgroundOscillator = null;
        backgroundGain = null;
    }
}


function playWrongSound() {
    stopBackgroundMusic();
    
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(150, audioContext.currentTime);
    osc.frequency.linearRampToValueAtTime(100, audioContext.currentTime + 0.5);
    osc.type = 'square';
    
    gain.gain.setValueAtTime(0.5, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.5);
}


function playGameOverMusic() {
    const notes = [
        { freq: 330, time: 0 },      
        { freq: 262, time: 0.3 },    
        { freq: 196, time: 0.6 }     
    ];
    
    notes.forEach(note => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.value = note.freq;
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0.3, audioContext.currentTime + note.time);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.time + 0.4);
        
        osc.start(audioContext.currentTime + note.time);
        osc.stop(audioContext.currentTime + note.time + 0.4);
    });
}

document.addEventListener("keypress", function(){
    if (started == false) {
        console.log("Game is started");
        started = true;
        startBackgroundMusic();
        levelUp();
    }
});

function gameFlash(btn) {
    btn.classList.add("flash");
    const btnColor = btn.getAttribute("id");
    playButtonSound(btnColor);
    setTimeout(function () {
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn) {
    btn.classList.add("userflash");
    const btnColor = btn.getAttribute("id");
    playButtonSound(btnColor);
    setTimeout(function () {
        btn.classList.remove("userflash");
    }, 250);
}

function levelUp(){
    userSeq = [];

    level++;
    h2.innerText = `Level ${level}`;

    let randIdx = Math.floor(Math.random() * 3);
    let randColor = btns[randIdx];
    let randBtn = document.querySelector(`.${randColor}`);
    gameSeq.push(randColor);
    console.log(gameSeq);
    gameFlash(randBtn);
}
function checkAns (idx) {
   if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length == gameSeq.length) { 
        setTimeout(levelUp, 1000);
    }
   } else {
    playWrongSound();
    setTimeout(function() {
        playGameOverMusic();
    }, 300);
    h2.innerHTML = `Game Over! your score was <b>${level}</b> <br> press any key to start.`;
    document.querySelector("body").style.backgroundColor = "red";
    setTimeout(function(){
        document.querySelector("body").style.backgroundColor = "white";
        }, 150);
        reset();
   }
}
function btnPress() {
    console.log(this);
    let btn = this;
    userFlash(btn);

    userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkAns (userSeq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for (btn of allBtns) {
    btn.addEventListener("click", btnPress);
}
function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    stopBackgroundMusic();
}