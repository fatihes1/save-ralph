// Canvas bağlantısı
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Canvas W and H are same with CSS
canvas.width = 1350;
canvas.height = 900;

// Global değişkenler
const cellSize = 150;
const cellGap = 4.5;
const gameGrid = [];
const defenders = [];
const enemies = [];
const enemyPosition = [];
const projectiles = [];
const winningScore = 60;
const resources = [];


let numberOfResources = 300;
let enemiesInterval = 600;
let frame = 0;
let gameOver = false;
let score = 0;
let choosenDefender = 1;

const save = new Image();
save.src = 'images/control.png';

// Sounds
const appleAudio = new Audio();
appleAudio.src = 'sounds/apple.mp3';
const smash = new Audio();
smash.src = 'sounds/smash.mp3';
const completeLevel = new Audio();
completeLevel.src = 'sounds/complete.mp3';

// Mouse
const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
    clicked: false
}
// Mouse tıklandı mı kontrolü için : listener
canvas.addEventListener('mousedown', function () {
    mouse.clicked = true;
});
canvas.addEventListener('mouseup', function () {
    mouse.clicked = false;
});


let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function (e) {
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener('mouseleave', function () {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Oyun alanı
const controlsBar = {
    width: canvas.width,
    height: cellSize
}

// Hücreler için sınıf tanımlaması
class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw() {
        if (mouse.x && mouse.y && collision(this, mouse)) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
// Canvasın tamamını hücreler ile doldurma
function createGrid() {
    for (let y = cellSize; y < canvas.height; y += cellSize) {
        for (let x = 0; x < canvas.width; x += cellSize) {
            gameGrid.push(new Cell(x, y));
        }
    }
}
createGrid();
function handleGameGrid() {
    for (let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw();
    }
}

const apple = new Image();
apple.src = 'images/apple.png'
// Mermiler
class Projectiles {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 35;
        this.height = 35;
        this.power = 20;
        this.speed = 5; // merminin gidiş hızı ile ilgili hangi aralıkla atacağı değil
    }
    update() {
        this.x += this.speed;
    }
    draw() {
        //ctx.fillStyle = 'orange';
        ctx.beginPath();
        //ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        ctx.drawImage(apple, this.x, this.y, this.width, this.height);
        ctx.fill();
    }
}
function handleProjectiles() {
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].update();
        projectiles[i].draw();

        // Mermi ile düşmanın çarpışma durumu
        for (let j = 0; j < enemies.length; j++) {
            if (enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])) {
                enemies[j].health -= projectiles[i].power;
                smash.play();
                projectiles.splice(i, 1); // mermi düşmana çarptığı an kaybolacak
                i--;
            }
        }
        if (projectiles[i] && projectiles[i].x > canvas.width - cellSize) {
            projectiles.splice(i, 1);
            i--;
        }
    }
}


// Savunucu Takım

const defender1 = new Image();
defender1.src = 'images/defender1.png';
const defender2 = new Image();
defender2.src = 'images/defender2.png';


class Defender {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.shooting = false;
        this.shootNow = false;
        this.health = 100;
        this.projectiles = [];
        this.timer = 0;
        this.frameX = 0;
        this.framey = 0;
        this.spriteWidth = 152
        this.spriteHeight = 152;
        this.minFrame = 0;
        this.maxFrame = 10;
        this.choosenDefender = choosenDefender;
    }
    draw() {
        //ctx.fillStyle = 'green';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'gold';
        ctx.font = '30px Orbitron';
        ctx.fillText(Math.floor(this.health), this.x + 34, this.y + 35); // Canın görünüm durumu -text-
        if (this.choosenDefender === 1) {
            ctx.drawImage(defender1,
                this.frameX * this.spriteWidth,
                0,
                this.spriteWidth,
                this.spriteHeight,
                this.x,
                this.y,
                this.width,
                this.height);
        }

    }
    update() {
        if (frame % 10 === 0) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = this.minFrame;
            if (this.frameX === 5) this.shootNow = true;
        }
        if (this.shooting) {
            this.minFrame = 0;
            this.maxFrame = 10;
        } else {
            this.minFrame = 0;
            this.maxFrame = 2;
        }
        if (this.shooting && this.shootNow) {

            projectiles.push(new Projectiles(this.x + 70, this.y + 70));
            appleAudio.play();

            this.shootNow = false;
        }

    }
}


function handleDefenders() {
    for (let j = 0; j < defenders.length; j++) {
        defenders[j].draw();
        defenders[j].update();
        // Düşman ile savunmacı aynı yatay hizada ise
        if (enemyPosition.indexOf(defenders[j].y) !== -1) {
            defenders[j].shooting = true;
        } else {
            defenders[j].shooting = false;
        }
        for (let k = 0; k < enemies.length; k++) {
            // Düşman, savunucuyla çarpıştığı an
            if (defenders[j] && collision(defenders[j], enemies[k])) {
                enemies[k].movement = 0;
                defenders[j].health -= 0.2;
            }
            // Savunmacı varsa ve düşmanın canı sıfıra gelmişse
            if (defenders[j] && defenders[j].health <= 0) {
                defenders.splice(j, 1);
                j--;
                enemies[k].movement = 0.4;
            }
        }
    }
}
const card1 = {
    x: 15,
    y: 15,
    width: 105,
    height: 127.5
}
const card2 = {
    x: 125,
    y: 15,
    width: 105,
    height: 127.5
}
const comingSoon = new Image();
comingSoon.src = 'images/soon.png';
const soonHero = new Image();
soonHero.src = 'images/soonHero.png';

function chooseDefender() {
    let card1Strooke = 'black';
    let card2Strooke = 'black';
    if (collision(mouse, card1) && mouse.clicked) {
        choosenDefender = 1;
    }


    if (choosenDefender === 1) {
        card1Strooke = 'gold';
        card2Strooke = 'black';
    } else if (choosenDefender === 2) {
        card1Strooke = 'black';
        card2Strooke = 'gold';
    } else {
        card1Strooke = 'black';
        card2Strooke = 'black';
    }

    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(card1.x, card1.y, card1.width, card1.height);
    ctx.strokeStyle = card1Strooke;
    ctx.strokeRect(card1.x, card1.y, card1.width, card1.height);
    ctx.drawImage(defender1, 0, 0, 200, 200, 0, 5, 175, 175);

    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(card2.x, card2.y, card2.width, card2.height);
    ctx.strokeStyle = card2Strooke;
    ctx.strokeRect(card2.x, card2.y, card2.width, card2.height);
    ctx.drawImage(soonHero, 0, 0, 131, 142, 125, 15, 105, 127.5);
    ctx.drawImage(comingSoon, 0, 0, 400, 400, 120, 20, 120, 120);
}

// Kaybolan metinler
const floatingMessages = [];
class FloatingMessage {
    constructor(text, x, y, size, color) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.size = size;
        this.lifeSpan = 0;
        this.color = color;
        this.opacity = 1;
    }
    update() {
        this.y -= 0.3;
        this.lifeSpan += 1;
        if (this.opacity > 0.03) this.opacity -= 0.03;
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.font = this.size + 'px Orbitron';
        ctx.fillText(this.text, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}
function handleFloatingMessages() {
    for (let i = 0; i < floatingMessages.length; i++) {
        floatingMessages[i].update();
        floatingMessages[i].draw();
        if (floatingMessages[i].lifeSpan >= 50) {
            floatingMessages.splice(i, 1);
            i--;
        }
    }
}
const enemyTypes = [];
const enemy1 = new Image();
enemy1.src = 'images/enemy1.png';
const enemy2 = new Image();
enemy2.src = 'images/enemy2.png';
enemyTypes.push(enemy1);
enemyTypes.push(enemy2);

// Saldıran Takım
class Enemy {
    constructor(verticalPosition) {
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = cellSize - cellGap * 2; // cellSize - cellGap * 2
        this.height = cellSize - cellGap * 2;
        //this.speed = Math.random() * 0.2 + 0.4; //TODO: 0.4 normally TODO:
        //this.movement = this.speed;
        //this.health = 100;
        //this.maxHealth = this.health;
        this.enemyTypes = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        this.frameX = 0;
        this.frameY = 0; // its for multiline sprite
        this.minFrame = 0;
        if (this.enemyTypes === enemyTypes[0]) {
            this.maxFrame = 14;
            this.speed = 1.3;
            this.movement = this.speed;
            this.health = 60;
            this.maxHealth = this.health;

        } else if (this.enemyTypes === enemyTypes[1]) {
            this.maxFrame = 15;
            this.speed = 0.4;
            this.movement = this.speed;
            this.health = 140;
            this.maxHealth = this.health;
        }
        this.spriteWidth = 150;
        this.spriteHeight = 150;

    }
    update() {
        this.x -= this.movement; // yatay sola doğru hareketi
        // animasyonu yavaşlatmak için
        if (frame % 2 === 0) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = this.minFrame;
        }
        this.x -= this.movement; // yatay sola doğru hareketi

    }
    draw() {
        //ctx.fillStyle = 'red';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '30px Orbitron';
        ctx.fillText(Math.floor(this.health), this.x + 25, this.y + 27) // Canın görünüm durumu -text-
        // resmin çizilmesi
        //ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
        ctx.drawImage(this.enemyTypes,
            this.frameX * this.spriteWidth,
            0,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width,
            this.height);

    }
}
function handleEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i].x < 0) {
            gameOver = true;
        }
        // Düşman canı sıfır olunca ortadan kaybolma durumu
        if (enemies[i].health <= 0) {
            let gainedResources = enemies[i].maxHealth / 10;
            floatingMessages.push(new FloatingMessage('+' + gainedResources, enemies[i].x, enemies[i].y, 30, 'black'));
            floatingMessages.push(new FloatingMessage('+' + gainedResources, 375, 75, 45, 'gold'));
            numberOfResources += gainedResources;
            score += gainedResources;
            const findThisIndex = enemyPosition.indexOf(enemies[i].y);
            enemyPosition.splice(findThisIndex, 1);
            enemies.splice(i, 1);
            i--;
        }
    }
    if (frame % enemiesInterval === 0 && score < winningScore) {
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
        enemies.push(new Enemy(verticalPosition));
        enemyPosition.push(verticalPosition);
        if (enemiesInterval > 120) {
            enemiesInterval -= 50;
        }
    }
}
// Gold  -kaynak-
const amounts = [20, 40, 60];
const coin = new Image();
coin.src = 'images/coin.png';

var coinSound = new Audio();
coinSound.src = 'sounds/coin.mp3';

class Resource {
    constructor() {
        this.x = Math.random() * (canvas.width - cellSize);
        this.y = (Math.floor(Math.random() * 5) + 1) * cellSize + 32.5;
        this.width = cellSize * 0.6;
        this.height = cellSize * 0.6;
        // Düşecek altına random bir değer atanıyor
        this.amount = amounts[Math.floor(Math.random() * amounts.length)];
    }
    draw() {
        //ctx.fillStyle = 'yellow';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(coin, this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '30px Orbitron';
        ctx.fillText(this.amount, this.x + 22.5, this.y + 55);
    }
}
function handleResources() {
    if (frame % 500 === 0 && score < winningScore) {
        resources.push(new Resource());
    }
    for (let j = 0; j < resources.length; j++) {
        resources[j].draw();
        if (resources[j] && mouse.x && mouse.y && collision(resources[j], mouse)) { // Coin alma anı
            numberOfResources += resources[j].amount;
            coinSound.play();
            floatingMessages.push(new FloatingMessage('+' + resources[j].amount, resources[j].x, resources[j].y, 45, 'black'));
            floatingMessages.push(new FloatingMessage('+' + resources[j].amount, 570, 75, 45, 'gold')); // controlsBar mesajı
            resources.splice(j, 1);
            j--;
        }
    }
}
// Oyun Durumu
var gameOverSound = new Audio();
gameOverSound.src = 'sounds/gameover.wav';


const gameOverImage = new Image();
gameOverImage.src = 'images/gameover.png';
function handleGameStatus() {
    ctx.fillStyle = 'gold';
    ctx.font = '45px Orbitron';
    ctx.fillText('Score : ' + score, 250, 60);
    ctx.fillText('Resources : ' + numberOfResources, 250, 120);
    if (gameOver) {
        //ctx.fillStyle = 'black';
        //ctx.font = '135px Orbitron';
        //ctx.fillText('GAME OVER', 202.5, 450);

        ctx.drawImage(gameOverImage, 290, 323, 770, 254);
        gameOverSound.play();
        ctx.fillStyle = 'black';
        ctx.font = '30px Orbitron';
        ctx.fillText('Press F5 to play again or refresh the page.', 330, 710);
    }
    if (score > winningScore && enemies.length === 0) {
        ctx.fillStyle = 'black';
        ctx.font = '90px Orbitron';
        ctx.fillText('LEVEL COMPLETE', 195, 450);
        completeLevel.play();
        ctx.font = '45px Orbitron';
        ctx.fillText('You win with ' + score + ' points!', 201, 510);
        ctx.font = '30px Orbitron';
        ctx.fillText('Press F5 to play again or refresh the page.', 300, 710);
    }
}


// Hücrelere savunucu eklemek 
canvas.addEventListener('click', function () {
    // + cellGap köşelerde çakışma olma durumları için
    const girdPositionX = mouse.x - (mouse.x % cellSize) + cellGap;  // En yakın H grid pozisyonu
    const girdPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
    if (girdPositionY < cellSize) { // Control barına tıklanma durumu
        return;
    };
    // Tek alana birden fazla savunucu ekleme sorunu
    for (let i = 0; i < defenders.length; i++) {
        if (defenders[i].x === girdPositionX && defenders[i].y === girdPositionY)
            return;
    }
    let defenderCost = 100;
    if (numberOfResources >= defenderCost) {
        defenders.push(new Defender(girdPositionX, girdPositionY));
        numberOfResources -= defenderCost;
        floatingMessages.push(new FloatingMessage('-' + defenderCost, 570, 75, 45, 'gold'));
    } else {
        floatingMessages.push(new FloatingMessage('need more resources', mouse.x, mouse.y, 30, 'blue'));
    }
});



const bg = new Image();
bg.src = 'images/bg.png';
// Recursive fonksiyon

function animation() {
    // constrolsBar
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.fillStyle = 'blue';
    //ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
    ctx.drawImage(save, 0, 0);
    // oyun alanı arka plan
    ctx.drawImage(bg, 0, cellSize);
    handleGameGrid();
    handleDefenders();
    handleResources();
    handleProjectiles();
    handleEnemies();
    chooseDefender();
    handleGameStatus();
    handleFloatingMessages();
    frame++;
    if (!gameOver) { requestAnimationFrame(animation); }


}

animation();



// Çarpışma -çakışma- durum kontrolü
function collision(first, second) {
    if (!(first.x > second.x + second.width ||
        first.x + first.width < second.x ||
        first.y > second.y + second.height ||
        first.y + first.height < second.y)
    ) {
        return true;
    };
};

window.addEventListener('resize', function () {
    canvasPosition = canvas.getBoundingClientRect();
})