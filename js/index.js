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

function gameTileSelector (gameState) {
    return `.row${gameState.attemptCounter} .tile${gameState.characterCounter}`
}

function deletePressed (gameState) {
    if (gameState.characterCounter > 0) {
        gameState.attemptedWord = gameState.attemptedWord.slice(0, gameState.attemptedWord.length - 1)
        gameState.characterCounter--
        document.querySelector(gameTileSelector(gameState)).textContent = ''
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

function checkWord(gameState) {
    let correctLetters = 0
    let correctPositions = 0
    let expectedWordCopy = gameState.expectedWord.slice()

    for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = document.querySelector(`.row${gameState.attemptCounter}` + ' .tile' + i)
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
        } else {
            resultArea.classList.toggle('hidden')
            gameEndMessage.textContent = 'You suck. Try again?'
            retryButton.classList.toggle('hidden')
        }
    }
}

function tryAgain(e) {
    const resultArea = document.querySelector('.result')
    const retryButton = document.querySelector('.retry-button')
    const targetKeyboard = document.querySelector('.keyboard')
    const allTiles = document.querySelectorAll('.game > * > span')
    const allKeys = document.querySelectorAll('.key')

    // Retry process
    gameState.attemptCounter = 0
    gameState.tryCounter++
    gameState.expectedWord = e[gameState.tryCounter].toUpperCase().split("")

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

fetch('words.json')
    .then(response => response.json())
    .then(words => {
        const wordsArr = words['fiveLetterWords']
        const shuffledWords = shuffle(wordsArr)
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
        targetBackspace.addEventListener('click', function () {
            deletePressed(gameState)
        })
        targetEnter.addEventListener('click', function () {
            enterPressed(gameState)
        })

        // MAKE THE REAL KEYBOARD WORK
        const characterSet = 'abcdefghijklmnopqrstuvwxyz'

        document.addEventListener('keyup', function (event) {
            if (!gameState.success) {
                if (characterSet.includes(event.key.toLowerCase()) && gameState.attemptedWord.length < WORD_LENGTH ) {
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

        retryButton.addEventListener('click', function () {
            tryAgain(shuffledWords)
        })
    })
    .catch(error => console.error(`An error occurred: ${error.message}`))
