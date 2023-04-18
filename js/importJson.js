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

fetch('words.json')
    .then(response => response.json())
    .then(words => {
        const wordsArr = words['fiveLetterWords']
        const shuffledWords = shuffle(wordsArr)
        const expectedWord = shuffledWords[0].toUpperCase().split("")
        console.log(`Expected Word: ${expectedWord}`)
    })
    .catch(error => console.error(`An error occurred: ${error.message}`))
