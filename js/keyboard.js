function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex !== 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

let expectedWord = []
fetch('words.json')
    .then(response => response.json())
    .then(words => {
        const wordsArr = words['fiveLetterWords']
        const shuffledWords = shuffle(wordsArr)
        expectedWord = shuffledWords[0].toUpperCase().split("")
        console.log(expectedWord)
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
                    document.querySelector('.tile' + characterCounter).innerHTML = letter.innerHTML
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
                document.querySelector('.tile' + characterCounter).innerHTML = ''
                // characterCounter--
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
                    document.querySelector('.tile' + characterCounter).innerHTML = event.key
                    characterCounter++
                    console.log(attemptedWord, characterCounter)
                }
            }

            if (event.key == 'Backspace') {
                deleteLetter()
            }

            if (event.key == 'Enter') {
                enterPressed()
                console.log(checkWord(expectedWord,attemptedWord))
                            }
        })

        // console.log(attemptedWord)

        function checkWord(expectedWord,attemptedWord) {
            let correctLetters = 0
            let correctPositions = 0
            for (let i=0; i < attemptedWord.length; i++) {
                if (attemptedWord[i]===expectedWord[i]) {
                    correctPositions++
                }
                if (expectedWord.includes(attemptedWord[i]) && attemptedWord[i] !== expectedWord[i]){
                    correctLetters++
                }

            }
            console.log(correctPositions)
            return correctPositions === 5 ? 'Correct' : 'Incorrect'

        }



    })
    .catch(error => console.error(`An error occurred: ${error.message}`))






//
// let attemptedWord = []
// let characterCounter = 0
// // let attemptCounter = 0 - useful later
//
// // MAKE ON SCREEN LETTERS WORK
// const onScreenLetters = document.querySelectorAll('.key')
// const backspace = document.querySelector('.backspace')
// const enter = document.querySelector('.enter')
// onScreenLetters.forEach(function (letter) {
//     letter.addEventListener('click', function () {
//         if (attemptedWord.length < 5) {
//             attemptedWord.push(letter.innerHTML)
//             document.querySelector('.tile' + characterCounter).innerHTML = letter.innerHTML
//             characterCounter++
//             console.log(attemptedWord, characterCounter)
//         }
//     })
// })
//
// backspace.addEventListener('click', deleteLetter)
// enter.addEventListener('click', enterPressed)
//
// function deleteLetter (e) {
//     if (characterCounter > 0) {
//         attemptedWord = attemptedWord.slice(0, attemptedWord.length - 1)
//         characterCounter--
//         document.querySelector('.tile' + characterCounter).innerHTML = ''
//         // characterCounter--
//         console.log(attemptedWord, characterCounter)
//     }
// }
//
// function enterPressed () {
//     if (attemptedWord.length === 5) {
//         console.log('submitted word')
//     } else {
//         console.log('enter 5 characters')
//     }
// }
//
// // MAKE THE REAL KEYBOARD WORK
// const alphabet = 'abcdefghijklmnopqrstuvwxyz'
// document.addEventListener('keyup', (event) => {
//     if (attemptedWord.length < 5) {
//         if (alphabet.includes(event.key)) {
//             attemptedWord.push(event.key.toUpperCase())
//             document.querySelector('.tile' + characterCounter).innerHTML = event.key
//             characterCounter++
//             console.log(attemptedWord, characterCounter)
//         }
//     }
//
//     if (event.key == 'Backspace') {
//         deleteLetter()
//     }
//
//     if (event.key == 'Enter') {
//         enterPressed()
//     }
// })
//
// console.log(attemptedWord)
