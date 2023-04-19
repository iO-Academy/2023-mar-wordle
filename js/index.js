function shuffle(array) {
    let currentIndex = array.length, randomIndex;

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
        const targetOnScreenLetters = document.querySelectorAll('.key')
        const targetBackspace = document.querySelector('.backspace')
        const targetEnter = document.querySelector('.enter')
        targetOnScreenLetters.forEach(function (letter) {
            letter.addEventListener('click', function () {
                if (attemptedWord.length < 5) {
                    attemptedWord.push(letter.innerHTML)
                    document.querySelector('.tile' + characterCounter).innerHTML = letter.innerHTML
                    characterCounter++
                    console.log(attemptedWord, characterCounter)
                }
            })
        })

        targetBackspace.addEventListener('click', deleteLetter)
        targetEnter.addEventListener('click', enterPressed)

        function deleteLetter () {
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
                alert(result)
            }
        }

// MAKE THE REAL KEYBOARD WORK
        const characterSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        document.addEventListener('keyup', (event) => {
            if (attemptedWord.length < 5) {
                if (characterSet.includes(event.key)) {
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
    })
    .catch(error => console.error(`An error occurred: ${error.message}`))
