const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d")
const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghosts");

let creatRect = (x,  y,  width,  height,  color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x,  y,  width,  height);
};
let fps = 30;
let oneBlockSizze = 20;
let wallColor = "#342DCA";
let wallSpaceWidth = oneBlockSizze / 1.5;
let wallOffset = (oneBlockSizze - wallSpaceWidth) / 2;
let wallInnerColor = "black";
let foodColor = "#FEB897";
let score = 0;
let ghosts = [];
let ghostCount = 4;
let lives = 3;
let foodCount = 0;

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

let ghostLocations = [
    {x:0, y:0},
    {x:175, y:0},
    {x:0, y:120},
    {x:175, y:120},
]

let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], 
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1], 
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1], 
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], 
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1], 
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1], 
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1], 
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0], 
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1], 
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1], 
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1], 
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0], 
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0], 
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1], 
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], 
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1], 
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1], 
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1], 
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1], 
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1], 
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], 
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
];
for(let i = 0; i < map.length; i++){
    for(let j = 0; j < map[0].length; j++){
        if (map[i][j] == 2){
            foodCount++;
        }
    }
}

let randomTargetsForGhosts = [
    {x: 1 * oneBlockSizze, y: 1 * oneBlockSizze},
    {x: 1 * oneBlockSizze, y: (map.length - 2) * oneBlockSizze},
    {x: (map[0].length - 2) * oneBlockSizze, y: oneBlockSizze},
    {
        x: (map[0].length - 2) * oneBlockSizze,
        y: (map[0].length - 2) * oneBlockSizze,
    },
];

let gameloop = () => {
    draw();
    update();
};

let update = () => {
    pacman.moveProcess();
    pacman.eat();
    for (let i = 0; i < ghosts.length; i++){
        ghosts[i].moveProcess();
    }

    if (pacman.checkGhostCollision()){
        console.log("hit");
        restartGame();
    }
    if( score >= foodCount){
        drawWin();
        clearInterval(gameInterval);
    }
};

let restartGame = () => {
    createNewPacman();
    creatGhosts();
    lives--;
    if (lives === 0){
        gameOver()
    }
};

let gameOver = () => {
    drawGameOver();
    clearInterval(gameInterval);
};

let drawGameOver = () => {
    canvasContext.font = "40px 'Press Start 2P'";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Game Over!", 20, 230);
};

let drawWin = () => {
    canvasContext.font = "40px 'Press Start 2P'";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("You Win!", 50, 230);
}

let drawLives = () => {
    canvasContext.font = "20px 'Press Start 2P'";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "LIVES: ",
        220,
        oneBlockSizze * (map.length + 1) + 10
    );
    for (let i = 0; i < lives; i++){
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneBlockSizze,
            0,
            oneBlockSizze,
            oneBlockSizze,
            350 + i * oneBlockSizze,
            oneBlockSizze * map.length + 10,
            oneBlockSizze,
            oneBlockSizze
        );
    }
};

let drawFoods = () => {
    for(let i = 0; i < map.length; i++){
        for(let j = 0; j < map[0].length; j++){
            if (map[i][j] == 2){
                creatRect(
                    j * oneBlockSizze + oneBlockSizze / 3,
                    i * oneBlockSizze + oneBlockSizze / 3,
                    oneBlockSizze / 3,
                    oneBlockSizze / 3,
                    foodColor 
                );
            }
        }
    }
};

let drawScore = () => {
    canvasContext.font = "20px 'Press Start 2P'";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "SCORE: " + score,
        10,
        oneBlockSizze * (map.length + 1) + 10
    );
};

let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++){
        ghosts[i].draw();
    }
}

let draw = () => {
    creatRect(0, 0, canvas.width, canvas.height, "black");  
    drawWalls();
    drawFoods();
    pacman.draw();
    drawScore();
    drawGhosts();
    drawLives();
};

let gameInterval = setInterval(gameloop,  1000 / fps);


let drawWalls = () => {
    for(let i = 0; i < map.length; i++){
        for(let j = 0; j < map[0].length; j++){
            if(map[i][j] == 1) { // then it is a wall
                creatRect(
                    j * oneBlockSizze, 
                    i * oneBlockSizze, 
                    oneBlockSizze, 
                    oneBlockSizze, 
                    wallColor
                );
                if (i > 0 && map[i][j - 1] == 1){
                    creatRect(
                        j * oneBlockSizze,
                        i * oneBlockSizze + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }
                if(j < map[0].length - 1 && map[i][j + 1] == 1){
                    creatRect(
                        j * oneBlockSizze + wallOffset,
                        i * oneBlockSizze + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }
                if (i > 0 && map[i -1][j] == 1){
                    creatRect(
                        j * oneBlockSizze + wallOffset,
                        i * oneBlockSizze,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
                if(i < map[0].length - 1 && map[i + 1][j] == 1){
                    creatRect(
                        j * oneBlockSizze + wallOffset,
                        i * oneBlockSizze + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
            }
        }
    }
};

let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSizze,
        oneBlockSizze,
        oneBlockSizze,
        oneBlockSizze,
        oneBlockSizze / 5
    );
};

let creatGhosts = () => {
    ghosts = []
    for(let i = 0; i < ghostCount; i++){
        let newGhost = new Ghost(
            9 * oneBlockSizze + (i %2 == 0 ? 0 : 1) * oneBlockSizze,
            10 * oneBlockSizze + (i %2 == 0 ? 0 : 1) * oneBlockSizze,
            oneBlockSizze,
            oneBlockSizze,
            pacman.speed/2,
            ghostLocations[i % 4].x,
            ghostLocations[i % 4].y,
            125,
            115,
            6 + i,
            i
        );
        ghosts.push(newGhost);
    }
}

createNewPacman();
creatGhosts();
gameloop();

window.addEventListener("keydown", (event) => {
    let k = event.keyCode;

    setTimeout(() => {
        if (k == 37 || k == 65){
            //left
            pacman.nextDirection = DIRECTION_LEFT;
        } else if (k == 38 || k == 87){
            //up
            pacman.nextDirection = DIRECTION_UP;
        } else if (k == 39 || k == 68){
            //right
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if (k == 40 || k == 83){
            //bottom
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    }, 1);
});

