const board = document.querySelector(".board")
const startButton = document.querySelector(".btn-start")
const modal = document.querySelector(".modal")
const startGame = document.querySelector(".start-game")
const gameOver = document.querySelector(".game-over")
const restartButton = document.querySelector(".btn-restart")
const hightScoreElement = document.querySelector("#high-score")
const scoreElement = document.querySelector("#score")
const timeElement = document.querySelector("#time")


const blockHeight = 50
const blockWidth = 50

let score = 0
let time = `00-00`
let hightScore = localStorage.getItem("hightScore") || 0

hightScoreElement.innerText = hightScore
const cols = Math.floor(board.clientWidth / blockWidth)
const rows = Math.floor(board.clientHeight / blockHeight)
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }

const blocks = []
let IntervalId = null
let timerIntervalId = null
let direction = "right"
let snake = [{ x: 1, y: 3 }]


for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div')
        block.classList.add('block')
        board.appendChild(block)
        blocks[`${row}-${col}`] = block
    }
}

function render() {
    let head = null;
    blocks[`${food.x}-${food.y}`].classList.add("food")

    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    } else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    } else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y }
    } else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(IntervalId)
        modal.style.display = "flex"
        startGame.style.display = "none"
        gameOver.style.display = "flex"
        return
    }

    // Food consume logic
    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        blocks[`${food.x}-${food.y}`].classList.add("food")

        snake.unshift(head)

        score += 10
        scoreElement.innerText = score

        if (score > hightScore) {
            hightScore = score
            localStorage.setItem("hightScore", hightScore.toString())
        }

    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })

    snake.unshift(head)
    snake.pop()

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill")
    })
}

startButton.addEventListener("click", () => {
    modal.style.display = "none"
    IntervalId = setInterval(() => { render() }, 500)

    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number)

        if (sec == 59) {
            min += 1
            sec = 0
        } else {
            sec += 1
        }

        time = `${min}-${sec}`
        timeElement.innerText = time
    }, 1000)
})

restartButton.addEventListener("click", restartGame)

function restartGame() {

    blocks[`${food.x}-${food.y}`].classList.remove("food")
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })
    score = 0
    time = `00-00`

    scoreElement.innerText = score
    timeElement.innerHTML = time
    hightScoreElement.innerText = hightScore


    direction = "right"
    modal.style.display = "none"
    snake = [{ x: 1, y: 3 }]
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }

    IntervalId = setInterval(() => { render() }, 500)


}

addEventListener("keydown", (event) => {
    if (event.key == "ArrowUp") {
        direction = "up"
    } else if (event.key == "ArrowDown") {
        direction = "down"
    } else if (event.key == "ArrowLeft") {
        direction = "left"
    }
    else if (event.key == "ArrowRight") {
        direction = "right"
    }
})