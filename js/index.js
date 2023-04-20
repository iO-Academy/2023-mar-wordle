const gameState = {
    attemptCounter: 0,
    expectedWord: [],
    attemptedWord: [],
    characterCounter: 0,
    tryCounter: 0
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]]
    }
    return array;
}

function deletePressed (gameState) {
    if (gameState.characterCounter > 0) {
        gameState.attemptedWord = gameState.attemptedWord.slice(0, gameState.attemptedWord.length - 1)
        gameState.characterCounter--
        document.querySelector('.tile' + gameState.characterCounter).textContent = ''
    }
}

function enterPressed (gameState) {
    if (gameState.attemptedWord.length === 5) {
        const result = checkWord(gameState)
        alert(result ? 'Correct' : 'Incorrect')
    }
}

function checkWord(gameState) {
    let correctLetters = 0
    let correctPositions = 0
    gameState.expectedWord = ['H','E','L','L','O']
    console.log(gameState.expectedWord)
    let expectedWordCopy = gameState.expectedWord.slice()

    for (let i = 0; i < 5; i++) {
        console.log('iteration', i)
        const tile = document.querySelector('.tile' + i)
        console.log('tile', tile)
        // const onscreenTile = document.querySelector('.key' + gameState.attemptedWord[i])


        if (gameState.attemptedWord[i] === expectedWordCopy[i]) {
            correctPositions++
            // expectedWordCopy.splice(i, 1)
            expectedWordCopy[i] = ' '

            // gameState.attemptedWord.splice(i, 1)
            console.log(gameState.attemptedWord)
            console.log(expectedWordCopy)
            tile.classList.add('correct-position')
        }
    }
    for (let g = 0; g < 5; g++) {
        // onscreenTile.classList.add('correct-position')
        const tile = document.querySelector('.tile' + g)
        if (expectedWordCopy.includes(gameState.attemptedWord[g])) {
            correctLetters++
            expectedWordCopy[g] = ' '
            tile.classList.add('correct-letter')
            // onscreenTile.classList.add('correct-letter')
        } else{
            tile.classList.add('incorrect-letter')
            // onscreenTitle.classList.add('incorrect-letter')
        }

    }

    return correctPositions === 5
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

        targetOnScreenLetters.forEach(function (letter) {
            letter.addEventListener('click', function () {
                if (gameState.attemptedWord.length < 5) {
                    gameState.attemptedWord.push(letter.textContent)
                    document.querySelector('.tile' + gameState.characterCounter).textContent = letter.textContent
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
            if (characterSet.includes(event.key.toLowerCase()) && gameState.attemptedWord.length < 5 ) {
                gameState.attemptedWord.push(event.key.toUpperCase())
                document.querySelector('.tile' + gameState.characterCounter).textContent = event.key
                gameState.characterCounter++
            } else if (event.key == 'Backspace') {
                deletePressed(gameState)
            } else if (event.key == 'Enter') {
                enterPressed(gameState)
            }
        })
    })
    .catch(error => console.error(`An error occurred: ${error.message}`))
