let gameSeq = [];
let userSeq = [];
let btns = ["btn1", "btn2", "btn3", "btn4", "btn5", "btn6"];
let started = false; 
let level = 0;
let highScore = localStorage.getItem("highScore") || 0;

let h2 = document.querySelector("h2");
let highScoreDisplay = document.querySelector("#highScore");

highScoreDisplay.innerText = highScore;

document.addEventListener("keypress", function(){

    if (started == false) {

        started = true;

        levelUp();
    }
});

function gameFlash(btn) {
    btn.classList.add("flash");

    setTimeout(function () {
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn) {
    btn.classList.add("userflash");

    setTimeout(function () {
        btn.classList.remove("userflash");
    }, 250);
}

function levelUp(){
    userSeq = [];

    level++;
    h2.innerText = `Level ${level}`;

    let randIdx = Math.floor(Math.random() * 6);
    let randColor = btns[randIdx];
    let randBtn = document.querySelector(`#${randColor}`);
    gameSeq.push(randColor);

    gameFlash(randBtn);
}

function checkAns(idx) {
   if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length == gameSeq.length) { 
        setTimeout(levelUp, 1000);
    }
   } else {
    let wrongBtn = document.querySelector(`#${userSeq[idx]}`);
    
    for(let i = 0; i < 3; i++) {
        setTimeout(function() {
            wrongBtn.classList.add("flash");
        }, i * 200);
        
        setTimeout(function() {
            wrongBtn.classList.remove("flash");
        }, i * 200 + 100);
    }
    
    setTimeout(function() {
      
        if (level > highScore) {
            highScore = level;
            localStorage.setItem("highScore", highScore);
            highScoreDisplay.innerText = highScore;
            h2.innerHTML = `Game Over! Your score was <b>${level}</b> <br> New High Score! 🎉 <br> press any key to start.`;
        } else {
            h2.innerHTML = `Game Over! your score was <b>${level}</b> <br> High Score: <b>${highScore}</b> <br> press any key to start.`;
        }
        reset();
    }, 700);
   }
}

function btnPress() {

    let btn = this;
    userFlash(btn);

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkAns(userSeq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for (let btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

let resetBtn = document.querySelector("#resetBtn");

resetBtn.addEventListener("click", function() {
    highScore = 0;
    localStorage.removeItem("highScore");
    highScoreDisplay.innerText = 0;
    alert("High Score Reset!");
});

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    
}

