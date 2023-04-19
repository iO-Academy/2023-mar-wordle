
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
        document.querySelector('.tile' + gameState.characterCounter).innerHTML = ''
        // characterCounter--
        console.log(gameState.attemptedWord, gameState.characterCounter)
    }
}

// function deletePressed () {
//     if (characterCounter > 0) {
//         attemptedWord = attemptedWord.slice(0, attemptedWord.length - 1)
//         characterCounter--
//         document.querySelector('.tile' + characterCounter).innerHTML = ''
//         // characterCounter--
//         console.log(attemptedWord, characterCounter)
//     }
// }

// console.log(typeof(gameState.attemptedWord))
function enterPressed (gameState) {
    if (gameState.attemptedWord.length === 5) {
        const result = checkWord(gameState)
        alert(result)
    }
}

function checkWord(gameState) {
    let correctLetters = 0
    let correctPositions = 0
    console.log(gameState)
    for (let i = 0; i < gameState.attemptedWord.length; i++) {
        if (gameState.attemptedWord[i] === gameState.expectedWord[i]) {
            correctPositions++
        }
        if (gameState.expectedWord.includes(gameState.attemptedWord[i])
            && gameState.attemptedWord[i] !== gameState.expectedWord[i]){
            correctLetters++
        }
    }
    return correctPositions === 5 ? 'Correct' : 'Incorrect'
}

fetch('words.json')
    .then(response => response.json())
    .then(words => {
        const wordsArr = words['fiveLetterWords']
        const shuffledWords = shuffle(wordsArr)
        gameState.expectedWord = shuffledWords[0].toUpperCase().split("")
        console.log(gameState.expectedWord)

// let attemptCounter = 0 - useful later

// MAKE ON SCREEN LETTERS WORK
        const targetOnScreenLetters = document.querySelectorAll('.key')
        const targetBackspace = document.querySelector('.backspace')
        const targetEnter = document.querySelector('.enter')
        targetOnScreenLetters.forEach(function (letter) {
            letter.addEventListener('click', function () {
                if (gameState.attemptedWord.length < 5) {
                    gameState.attemptedWord.push(letter.innerHTML)
                    document.querySelector('.tile' + gameState.characterCounter).innerHTML = letter.innerHTML
                    gameState.characterCounter++
                    console.log(gameState.attemptedWord, gameState.characterCounter)
                }
            })
        })

        targetBackspace.addEventListener('click', function () {
            deletePressed(gameState)
        })
        targetEnter.addEventListener('click', function () {
            enterPressed(gameState)
        })

        // function deletePressed () {
        //     if (characterCounter > 0) {
        //         attemptedWord = attemptedWord.slice(0, attemptedWord.length - 1)
        //         characterCounter--
        //         document.querySelector('.tile' + characterCounter).innerHTML = ''
        //         // characterCounter--
        //         console.log(attemptedWord, characterCounter)
        //     }
        // }

        // function enterPressed () {
        //     if (attemptedWord.length === 5) {
        //         const result = checkWord(expectedWord,attemptedWord)
        //         alert(result)
        //     }
        // }

// MAKE THE REAL KEYBOARD WORK
        const characterSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        document.addEventListener('keyup', (event) => {
            if (gameState.attemptedWord.length < 5) {
                if (characterSet.includes(event.key)) {
                    gameState.attemptedWord.push(event.key.toUpperCase())
                    document.querySelector('.tile' + gameState.characterCounter).innerHTML = event.key
                    gameState.characterCounter++
                    console.log(gameState.attemptedWord, gameState.characterCounter)
                }
            }

            if (event.key == 'Backspace') {
                deletePressed(gameState)
            }

            if (event.key == 'Enter') {
                enterPressed(gameState.attemptedWord, gameState.expectedWord)
            }
        })

        // function checkWord(expectedWord,attemptedWord) {
        //     let correctLetters = 0
        //     let correctPositions = 0
        //     for (let i = 0; i < attemptedWord.length; i++) {
        //         if (attemptedWord[i] === expectedWord[i]) {
        //             correctPositions++
        //         }
        //         if (expectedWord.includes(attemptedWord[i]) && attemptedWord[i] !== expectedWord[i]){
        //             correctLetters++
        //         }
        //     }
        //     return correctPositions === 5 ? 'Correct' : 'Incorrect'
        // }
    })
    .catch(error => console.error(`An error occurred: ${error.message}`))

