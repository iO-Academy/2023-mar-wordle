const gameState = {
    attemptCounter: 0,
    expectedWord: [],
    attemptedWord: [],
    characterCounter: 0,
    tryCounter: 0,
    success: false
}

const WORD_LENGTH = 5
const CORRECT_POSITION_CLASS = 'correct-position'
const CORRECT_LETTER_CLASS = 'correct-letter'
const INCORRECT_LETTER_CLASS = 'incorrect-letter'
const CHARACTER_SET = 'abcdefghijklmnopqrstuvwxyz'

let shuffledWords = []

function shuffle(array) {
    let currentIndex = array.length, randomIndex
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]]
    }
    return array
}

function startTimer() {
    let endCountdown = JSON.parse(localStorage.endOfCountdown)
    countdownTimer()
    let tick = setInterval(countdownTimer, 1000)

    function countdownTimer() {
        const difference = endCountdown - Date.now()
        const seconds = Math.ceil((difference % (1000 * 60)) / 1000)
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        document.querySelector('.counter').innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
        if (difference < 0) {
            const retryButton = document.querySelector('.retry-button')
            clearInterval(tick);
            document.querySelector('.counter').innerHTML = "Try again..."; // update to retry button
            retryButton.classList.remove('hidden')
        }
    }
}

function enterPressed (gameState) {
    if (gameState.attemptedWord.length === WORD_LENGTH) {
        checkWord(gameState)
        gameState.attemptCounter++
        gameState.attemptedWord = []
        gameState.characterCounter = 0
        resultMessage(gameState.success)
    }
}

function deletePressed(gameState) {
    if (gameState.characterCounter > 0) {
        gameState.attemptedWord = gameState.attemptedWord.slice(0, gameState.attemptedWord.length - 1)
        gameState.characterCounter--
        document.querySelector(gameTileSelector(gameState)).textContent = ''
    }
}

function checkWord(gameState) {
    let correctLetters = 0
    let correctPositions = 0
    let expectedWordCopy = gameState.expectedWord.slice()

    for (let i = 0; i < WORD_LENGTH; i++) {
        const onscreenKey = document.querySelector('.' + gameState.attemptedWord[i].toLowerCase())
        onscreenKey.classList.add(INCORRECT_LETTER_CLASS)
        const tile = document.querySelector(`.row${gameState.attemptCounter}` + ' .tile' + i)
        tile.classList.add(INCORRECT_LETTER_CLASS)
        if (gameState.attemptedWord[i] === expectedWordCopy[i]) {
            correctPositions++
            expectedWordCopy[i] = ' '
            const onscreenKey = document.querySelector('.' + gameState.attemptedWord[i].toLowerCase())
            gameState.attemptedWord[i] = '0'
            tile.classList.add(CORRECT_POSITION_CLASS)
            onscreenKey.classList.add(CORRECT_POSITION_CLASS)
        }
    }

    for (let g = 0; g < WORD_LENGTH; g++) {
        for (let k = 0; k < WORD_LENGTH; k++) {
            const tile = document.querySelector(`.row${gameState.attemptCounter}` + ' .tile' + k)
            if (expectedWordCopy[g] === gameState.attemptedWord[k]) {
                const onscreenKey = document.querySelector('.' + gameState.attemptedWord[k].toLowerCase())
                correctLetters++
                expectedWordCopy[g] = ' '
                onscreenKey.classList.add(CORRECT_LETTER_CLASS)
                tile.classList.add(CORRECT_LETTER_CLASS)
            }
        }
    }

    if (correctPositions === WORD_LENGTH) {
        gameState.success = true
    }
}

function tryAgain(shuffledWords) {
    const resultArea = document.querySelector('.result')
    const retryButton = document.querySelector('.retry-button')
    const targetKeyboard = document.querySelector('.keyboard')
    const allTiles = document.querySelectorAll('.game > * > span')
    const allKeys = document.querySelectorAll('.key')

    // Retry process
    gameState.attemptCounter = 0
    gameState.tryCounter++
    gameState.expectedWord = shuffledWords[gameState.tryCounter].toUpperCase().split("")
    allTiles.forEach(function (tiles) {
        tiles.textContent = ''
        tiles.classList.remove(CORRECT_LETTER_CLASS, CORRECT_POSITION_CLASS, INCORRECT_LETTER_CLASS)
    })
    allKeys.forEach(function (key) {
        key.classList.remove(CORRECT_LETTER_CLASS, CORRECT_POSITION_CLASS, INCORRECT_LETTER_CLASS)
    })
    targetKeyboard.classList.remove('hidden')
    resultArea.classList.add('hidden')
    retryButton.classList.add('hidden')
}

function resultMessage(result) {
    const resultArea = document.querySelector('.result')
    const gameEndMessage = document.querySelector('.game-end-message')
    const retryButton = document.querySelector('.retry-button')
    const targetKeyboard = document.querySelector('.keyboard')

    if (gameState.attemptCounter === 6 || result) {
        targetKeyboard.classList.toggle('hidden')
        if (result) {
            resultArea.classList.toggle('hidden')
            const plural = gameState.attemptCounter === 1 ? `${gameState.attemptCounter} try` : `${gameState.attemptCounter} tries`
            gameEndMessage.textContent = `Success yay. You did it in ${plural}.`
            createTimestamp()
            startTimer()
        } else {
            resultArea.classList.toggle('hidden')
            gameEndMessage.textContent = 'Oops! you have run out of attempts.'
            retryButton.classList.toggle('hidden')
        }
    }
}

function createTimestamp() {
    let now = Date.now()
    let endCountdown = now + 5000  //change to 3600000 for 1 hour
    localStorage.setItem('endOfCountdown', JSON.stringify(endCountdown))
}

function gameTileSelector(gameState) {
    return `.row${gameState.attemptCounter} .tile${gameState.characterCounter}`
}

if (!localStorage.endOfCountdown || Date.now() > JSON.parse(localStorage.endOfCountdown)) {

    fetch('words.json')
        .then(response => response.json())
        .then(words => {
            const wordsArr = words['fiveLetterWords']
            shuffledWords = shuffle(wordsArr)
            localStorage.setItem('shuffledWords', JSON.stringify(shuffledWords))
            gameState.expectedWord = shuffledWords[0].toUpperCase().split("")

            // MAKE ON SCREEN LETTERS WORK
            const targetOnScreenLetters = document.querySelectorAll('.key')
            const targetBackspace = document.querySelector('.backspace')
            const targetEnter = document.querySelector('.enter')
            const retryButton = document.querySelector('.retry-button')
            targetOnScreenLetters.forEach(function (letter) {
                letter.addEventListener('click', function () {
                    if (gameState.attemptedWord.length < WORD_LENGTH) {
                        gameState.attemptedWord.push(letter.textContent)
                        document.querySelector(gameTileSelector(gameState)).textContent = letter.textContent
                        gameState.characterCounter++
                    }
                })
            })
            // Make keyboard work
            document.addEventListener('keyup', function (event) {
                if (!gameState.success) {
                    if (CHARACTER_SET.includes(event.key.toLowerCase()) && gameState.attemptedWord.length < WORD_LENGTH ) {
                        gameState.attemptedWord.push(event.key.toUpperCase())
                        document.querySelector(gameTileSelector(gameState)).textContent = event.key
                        gameState.characterCounter++
                    } else if (event.key === 'Backspace') {
                        deletePressed(gameState)
                    } else if (event.key === 'Enter') {
                        enterPressed(gameState)
                    }
                }
            })
            targetBackspace.addEventListener('click', function () {
                deletePressed(gameState)
            })
            targetEnter.addEventListener('click', function () {
                enterPressed(gameState)
            })
            retryButton.addEventListener('click', function () {
                location.reload()
            })
        })
        .catch(error => console.error(`An error occurred: ${error.message}`))

} else if (Date.now() < JSON.parse(localStorage.endOfCountdown)) {

    const targetKeyboard = document.querySelector('.keyboard')
    const resultArea = document.querySelector('.result')
    const gameEndMessage = document.querySelector('.game-end-message')
    const retryButton = document.querySelector('.retry-button')

    targetKeyboard.classList.add('hidden')
    resultArea.classList.remove('hidden')

    gameEndMessage.textContent = 'It is for your best...'
    retryButton.addEventListener('click', function () {
        location.reload()
    })

    startTimer()
}