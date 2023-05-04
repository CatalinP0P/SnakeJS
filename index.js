var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var background1 = "#acd645";
var background2 = "#a5d03a"

var score = 0;
const rows = 15;
const cols = 15;
const cellSize = 40;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;
var loop;

class Snake{
    constructor(row, col){
        this.body = [{row: row, col: col}, {row: row, col: col-1}, {row:row, col: col-2}];
        this.velocityX = 1;
        this.velocityY = 0;
        this.dead = false;
        this.nextDirections = [];
    }

    draw(){
        for ( var i=0; i<snake.body.length; i++ )
        {
            var x =  snake.body[i];
            var image = getSnakeImage(i);
            context.drawImage(image, x.col * cellSize, x.row * cellSize, cellSize, cellSize);
        }
    }

    move(){
        for ( var i = this.body.length-1; i>0; i-- )
        {
            this.body[i].row = this.body[i-1].row;
            this.body[i].col = this.body[i-1].col;
        }

        this.body[0].col += this.velocityX;
        this.body[0].row += this.velocityY;
    }

    checkIfDead(){
        var head = this.body[0];
        if ( head.col < 0 || head.row < 0 || head.col >= cols || head.row >= rows )
            return true;

        for ( var i=1; i<this.body.length; i++ )
        {
            var body = this.body[i];
            if ( head.row == body.row && head.col == body.col )
            {
                this.dead = true; 
                return true;
            }
        }
        return false;
    }

    changeDirection(){
        if ( this.nextDirections.length <= 0 ) return;
        var direction = this.nextDirections.pop();

        this.velocityX = direction.x;
        this.velocityY = direction.y;
    }
}
var snake = new Snake(7,3);

class Food{
    constructor(){
        this.row = Math.floor(Math.random() * rows);
        this.col = Math.floor(Math.random() * cols);
        this.image = document.getElementById("apple");
    }
    
    draw(){
        context.drawImage(this.image, this.col * cellSize, this.row * cellSize, cellSize, cellSize);
    }

    touched(){
        const snakeHead = snake.body[0];
        if ( snakeHead.row == this.row && snakeHead.col == this.col)
        {
            score++;
            document.getElementById("score").innerHTML =  "Score: " + score;
            return true;
        }
        
        return false;
    }
}
var food = new Food();

const drawBoard = () =>
{
    for ( var r=0; r<rows; r++ )
        for ( var c=0; c<cols; c++ )
        {
            if ( ( r + c ) % 2 == 0 )   
                context.fillStyle = background1;
            else
                context.fillStyle = background2;
            context.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
}

const update = () =>
{
    if ( snake.dead )
        return;

        
    var tail = snake.body[snake.body.length - 1];
    
    snake.changeDirection();
    snake.move();
    if ( food.touched() )
        snake.body.push({row: tail.row, col: tail.col}), food = new Food();

    if ( snake.checkIfDead() )
    {
        this.dead = true;
        alert("dead")
        clearInterval(loop);
        return;
    }

    drawBoard();
    food.draw();
    snake.draw();
}


const gameLoop = () =>
{
    loop = setInterval(() => update(), 1000/5);
}

gameLoop();


window.addEventListener("keydown", e =>
{
    if ( e.code == "KeyA" )
        if ( snake.nextDirections.length > 0 )
        {
            var lastDirection = snake.nextDirections[snake.nextDirections.length - 1];

            if ( lastDirection.x != 1 )
                snake.nextDirections.push({x: -1, y: 0})
        }
        else
            if ( snake.velocityX != 1 )
                snake.nextDirections.push({x: -1, y: 0});

    if ( e.code == "KeyD" )
        if ( snake.nextDirections.length > 0 )
        {
            var lastDirection = snake.nextDirections[snake.nextDirections.length - 1];
            
            if ( lastDirection.x != -1 )
                snake.nextDirections.push({x: 1, y: 0})
        }
        else
            if ( snake.velocityX != -1 )
                snake.nextDirections.push({x: 1, y: 0});
    
    if ( e.code == "KeyW" )
        if ( snake.nextDirections.length > 0 )
        {
            var lastDirection = snake.nextDirections[snake.nextDirections.length - 1];
            
            if ( lastDirection.y != 1 )
                snake.nextDirections.push({x: 0, y: -1})
        }
        else
            if ( snake.velocityY != 1 )
                snake.nextDirections.push({x: 0, y: -1});
    
    if ( e.code == "KeyS" )
        if ( snake.nextDirections.length > 0 )
        {
            var lastDirection = snake.nextDirections[snake.nextDirections.length - 1];
            
            if ( lastDirection.y != -1 )
                snake.nextDirections.push({x: 0, y: 1})
        }
        else
            if ( snake.velocityY != -1 )
                snake.nextDirections.push({x: 0, y: 1});
})

const getSnakeImage = (index) =>
{
    var body = snake.body[index];
    if ( index == 0 ) // Head
    {
        if ( snake.velocityX == 1 )
            return document.getElementById("head_right");
        if ( snake.velocityX == -1 )
            return document.getElementById("head_left");
        if ( snake.velocityY == 1 )
            return document.getElementById("head_down");
        if ( snake.velocityY == -1 )
            return document.getElementById("head_up");
    }

    var prevBody = snake.body[index-1];
    if ( index == snake.body.length - 1 ) // Tail
    {
        if ( prevBody.col == body.col )
            {
                if ( prevBody.row > body.row )
                    return document.getElementById("tail_up");
                else
                    return document.getElementById("tail_down");
            }
            else 
            {
                if ( prevBody.row == body.row )  
                {
                    if ( prevBody.col > body.col )
                        return document.getElementById("tail_left");
                    else 
                        return document.getElementById("tail_right")
                }
            }
    }

    var nextBody = snake.body[index+1];
    if ( body.col == prevBody.col && body.col == nextBody.col )
        return document.getElementById("body_vertical");
        
    if ( body.row == prevBody.row && body.row == nextBody.row )
        return document.getElementById("body_horizontal");

    if ( body.row == prevBody.row && body.col == nextBody.col && body.col > prevBody.col && body.row < nextBody.row)
        return document.getElementById("body_bottomleft");
    if ( body.row == nextBody.row && body.col == prevBody.col && body.col > nextBody.col && body.row < prevBody.row )
        return document.getElementById("body_bottomleft");

    if ( body.col == nextBody.col && body.row == prevBody.row && body.col < prevBody.col && body.row < nextBody.row )
        return document.getElementById("body_bottomright");
    if ( body.col == prevBody.col && body.row == nextBody.row && body.row < prevBody.row && body.col < nextBody.col )
        return document.getElementById("body_bottomright");
    
    if ( body.col == prevBody.col && body.row == nextBody.row && body.col < nextBody.col && body.row > prevBody.row )
        return document.getElementById("body_topright");
    if ( body.col == nextBody.col && body.row == prevBody.row && body.col < prevBody.col && body.row > nextBody.row )
        return document.getElementById("body_topright");

    if ( body.col == prevBody.col && body.row == nextBody.row && body.col > nextBody.col && body.row > prevBody.row )
        return document.getElementById("body_topleft");
    if ( body.col == nextBody.col && body.row == prevBody.row && body.col > prevBody.col && body.row > nextBody.row )
        return document.getElementById("body_topleft");
}