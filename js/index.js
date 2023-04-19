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
        let attemptCounter = 0

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
                const result = checkWord(expectedWord,attemptedWord)
                // alert(result)
                resultMessage(result)
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
                attemptCounter++
                enterPressed()
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
            return correctPositions === 5 ? 'Correct' : 'Incorrect'
        }



        function resultMessage(result) {
            let resultArea = document.querySelector('.result')
            let gameEndMessage = document.querySelector('.game-end-message')
            let retryButton = document.querySelector('.retry-button')
            let targetKeyboard = document.querySelector('.keyboard')
            if (attemptCounter === 6 || result === 'Correct') {
                targetKeyboard.classList.toggle('hidden')
                if (result === 'Correct') {
                    resultArea.classList.toggle('hidden')
                    gameEndMessage.innerHTML = `Success yay. You did it in ${attemptCounter} tries.`
                } else {
                    resultArea.classList.toggle('hidden')
                    gameEndMessage.innerHTML = 'You suck. Try again?'
                    retryButton.classList.toggle('hidden')
                }
            }
        }

    })
    .catch(error => console.error(`An error occurred: ${error.message}`))
