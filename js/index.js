const gameState = {
    attemptCounter: 0,
    expectedWord: [],
    attemptedWord: [],
    characterCounter: 0,
    tryCounter: 0,
    success: false
}

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

function deletePressed (gameState) {
    if (gameState.characterCounter > 0) {
        gameState.attemptedWord = gameState.attemptedWord.slice(0, gameState.attemptedWord.length - 1)
        gameState.characterCounter--
        document.querySelector(`.row${gameState.attemptCounter} .tile${gameState.characterCounter}`).textContent = ''
    }
    //
}

function enterPressed (gameState) {
    if (gameState.attemptedWord.length === 5) {
        const result = checkWord(gameState)
        gameState.attemptCounter++
        gameState.attemptedWord = []
        gameState.characterCounter = 0
        console.log(gameState)
        resultMessage(result)
    }
}

function checkWord(gameState) {
    let correctLetters = 0
    let correctPositions = 0
    for (let i = 0; i < gameState.attemptedWord.length; i++) {
        if (gameState.attemptedWord[i] === gameState.expectedWord[i]) {
            correctPositions++
        }
        if (gameState.expectedWord.includes(gameState.attemptedWord[i])
            && gameState.attemptedWord[i] !== gameState.expectedWord[i]) {
            correctLetters++
        }
    }
    if (correctPositions === 5) {
        gameState.success = true
    }
    return correctPositions === 5
}

function resultMessage(result) {
    let resultArea = document.querySelector('.result')
    let gameEndMessage = document.querySelector('.game-end-message')
    let retryButton = document.querySelector('.retry-button')
    let targetKeyboard = document.querySelector('.keyboard')

    if (gameState.attemptCounter === 6 || result === true) {
        targetKeyboard.classList.toggle('hidden')
        if (result === true) {
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

    // Retry process
    gameState.attemptCounter = 0
    gameState.tryCounter++
    gameState.expectedWord = e[gameState.tryCounter].toUpperCase().split("")
    allTiles.forEach(function (tiles) {
        tiles.textContent = ''
    })
    targetKeyboard.classList.remove('hidden')
    resultArea.classList.add('hidden')
    retryButton.classList.add('hidden')
    console.log(gameState.expectedWord)

}


fetch('words.json')
    .then(response => response.json())
    .then(words => {
        const wordsArr = words['fiveLetterWords']
        const shuffledWords = shuffle(wordsArr)
        gameState.expectedWord = shuffledWords[0].toUpperCase().split("")
        console.log(gameState.expectedWord)

        // MAKE ON SCREEN LETTERS WORK
        const targetOnScreenLetters = document.querySelectorAll('.key')
        const targetBackspace = document.querySelector('.backspace')
        const targetEnter = document.querySelector('.enter')
        const retryButton = document.querySelector('.retry-button')

        targetOnScreenLetters.forEach(function (letter) {
            letter.addEventListener('click', function () {
                if (gameState.attemptedWord.length < 5) {
                    gameState.attemptedWord.push(letter.textContent)
                    document.querySelector(`.row${gameState.attemptCounter} .tile${gameState.characterCounter}`).textContent = letter.textContent
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
                if (characterSet.includes(event.key.toLowerCase()) && gameState.attemptedWord.length < 5 ) {
                    gameState.attemptedWord.push(event.key.toUpperCase())
                    document.querySelector(`.row${gameState.attemptCounter} .tile${gameState.characterCounter}`).textContent = event.key
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
