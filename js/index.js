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
    if (gameState.attemptedWord.length === 5) {
        const result = checkWord(gameState)
        gameState.attemptCounter++
        gameState.attemptedWord = []
        gameState.characterCounter = 0
        resultMessage(result)
    }
}
console.log(gameState.expectedWord)
function checkWord(gameState) {
    let correctLetters = 0
    let correctPositions = 0
    gameState.expectedWord = ['H','E','L','L','O']
    console.log(gameState.expectedWord)
    let expectedWordCopy = gameState.expectedWord.slice()

    for (let i = 0; i < 5; i++) {
        console.log('iteration', i)
        const tile = document.querySelector(`.row${gameState.attemptCounter}` + ' .tile' + i)
        console.log('tile', tile)
        // const onscreenTile = document.querySelector('.key' + gameState.attemptedWord[i])


        if (gameState.attemptedWord[i] === expectedWordCopy[i]) {
            correctPositions++
            // expectedWordCopy.splice(i, 1)
            expectedWordCopy[i] = ' '

            // gameState.attemptedWord.splice(i, 1)
            console.log(gameState.attemptedWord)
            console.log(expectedWordCopy)
            console.log(gameState.expectedWord)
            tile.classList.add('correct-position')
        }
    }

    for (let g = 0; g < 5; g++) {
        // onscreenTile.classList.add('correct-position')
        const tile = document.querySelector(`.row${gameState.attemptCounter}` + ' .tile' + g)
        if (expectedWordCopy.includes(gameState.attemptedWord[g])) {
            j = expectedWordCopy.indexOf(gameState.attemptedWord[g])
            correctLetters++
            expectedWordCopy[j] = ' '

            tile.classList.add('correct-letter')
            // onscreenTile.classList.add('correct-letter')
        } else{
            tile.classList.add('incorrect-letter')
            // onscreenTitle.classList.add('incorrect-letter')
        }

    }
    if (correctPositions === 5) {
        gameState.success = true
    }
return correctPositions === 5
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

    // Retry process
    gameState.attemptCounter = 0
    gameState.tryCounter++
    gameState.expectedWord = e[gameState.tryCounter].toUpperCase().split("")
    allTiles.forEach(function (tiles) {
        tiles.textContent = ''
        tiles.classList.remove('correct-letter')
        tiles.classList.remove('incorrect-letter')
        tiles.classList.remove('correct-position')
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
                if (gameState.attemptedWord.length < 5) {
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
                if (characterSet.includes(event.key.toLowerCase()) && gameState.attemptedWord.length < 5 ) {
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
