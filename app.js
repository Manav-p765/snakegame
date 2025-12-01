const board = document.querySelector('.broad');
const st_btn = document.querySelector(".st-btn");
const re_btn = document.querySelector(".re-btn");
const modal = document.querySelector(".modal");
const restart = document.querySelector(".restart");
const start = document.querySelector(".start");

const highscore_elem = document.querySelector("#highscore")
const score_elem = document.querySelector("#score")
const time_element = document.querySelector("#time")
const block_height = 30
const block_width = 30

const cols = Math.floor(board.clientWidth / block_width);
const rows = Math.floor(board.clientHeight / block_height);

let blocks = []
let snake = [{x:1 , y:9},
    {x:1 , y:10},
    {x:1 , y:11}
]
let direction = "left"
let intervalId = null;
let timeintervalId = null;
let food = {x:Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)}
let high_score = localStorage.getItem("high_score") || 0
let score = 0
let time = `00-00`

highscore_elem.innerText = high_score

for(let row = 0 ; row < rows ; row++){
    for( let col = 0 ; col < cols ; col++){
        const block = document.createElement('div');
        block.classList.add("block")
        board.appendChild(block);
        // block.innerText = `${row}-${col}`
        blocks[ `${row}-${col}`] = block
    }
}

function render(){

    let head = null;

    blocks[ `${food.x}-${food.y}`].classList.add('food')

    if( direction === "left"){
        head = { x: snake[0].x, y: snake[0].y-1}
    } else if(direction ==="right"){
        head = { x: snake[0].x, y: snake[0].y+1}
    } else if(direction ==="up"){
        head = { x: snake[0].x-1, y: snake[0].y}
    } else if(direction ==="down"){
        head = { x: snake[0].x+1, y: snake[0].y}
    }

    if( head.x < 0 || head.y <0 || head.x >= rows || head.y >= cols){
            modal.style.display = "flex"
            restart.style.display = " flex"
            start.style.display = "none"
            clearInterval(intervalId);
        }

    snake.forEach(segment => {
        blocks[ `${segment.x}-${segment.y}`].classList.remove("fill")
    })

    if( head.x == food.x && head.y == food.y){
        blocks[ `${food.x}-${food.y}`].classList.remove('food')
        food = {x:Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)}
        blocks[ `${food.x}-${food.y}`].classList.add('food')

        snake.unshift(head)

        score += 10
        score_elem.innerText = score

        if(score >= high_score){
            high_score = score
            localStorage.getItem("high_score", high_score)
            highscore_elem.innerText = high_score
        }
    }


    snake.unshift(head)
    snake.pop()
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill')
    })
}


st_btn.addEventListener("click", () => {
    modal.style.display = "none"
    intervalId = setInterval(() =>{ render() }, 100)
    timeintervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number)
    
        if(sec == 59){
            min += 1
            sec = 0
        }else {
            sec += 1
        }

        time = `${min}-${sec}`
        time_element.innerText = time
    }, 1000)
})

re_btn.addEventListener("click" , () => {
    score = 0
    time = `00-00`
    score_elem.innerText = score
    time_element.innerText = time

    blocks[ `${food.x}-${food.y}`].classList.remove('food')

    modal.style.display ="none"
    direction = "down"
    snake = [{x:1 , y:3}]
    food = {x:Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)}

    intervalId = setInterval(() =>{ render() }, 300)
})

addEventListener("keydown", (event) =>{
    if(event.key == "ArrowUp"){
        direction = 'up'
    } else if(event.key == "ArrowDown"){
        direction = "down"
    } else if(event.key == "ArrowRight"){
        direction = "right"
    } else if(event.key == "ArrowLeft"){
        direction = "left"
    }
})
