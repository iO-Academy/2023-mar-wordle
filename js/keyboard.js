let attemptedWord = []
let characterCounter = 0
// let attemptCounter = 0 - useful later

// MAKE ON SCREEN LETTERS WORK
const onScreenLetters = document.querySelectorAll('.key')
const backspace = document.querySelector('.backspace')
const enter = document.querySelector('.enter')
onScreenLetters.forEach(function (letter) {
    letter.addEventListener('click', function () {
        if (attemptedWord.length < 5) {
            attemptedWord.push(letter.innerHTML)
            characterCounter++
            console.log(attemptedWord, characterCounter)
        }
    })
})

backspace.addEventListener('click', deleteLetter)
enter.addEventListener('click', enterPressed)

function deleteLetter (e) {
    if (characterCounter > 0) {
        attemptedWord = attemptedWord.slice(0, attemptedWord.length - 1)
        characterCounter--
        console.log(attemptedWord, characterCounter)
    }
}

function enterPressed () {
    if (attemptedWord.length === 5) {
        console.log('submitted word')
    } else {
        console.log('enter 5 characters')
    }
}

// MAKE THE REAL KEYBOARD WORK
const alphabet = 'abcdefghijklmnopqrstuvwxyz'
document.addEventListener('keyup', (event) => {
    if (attemptedWord.length < 5) {
        if (alphabet.includes(event.key)) {
            attemptedWord.push(event.key.toUpperCase())
            characterCounter++
            console.log(attemptedWord, characterCounter)
        }
    }

    if (event.key == 'Backspace') {
        deleteLetter()
    }

    if (event.key == 'Enter') {
        enterPressed()
    }
})
