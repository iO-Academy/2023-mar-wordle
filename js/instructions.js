const targetOpen = document.querySelector('.open')
const targetClose = document.querySelector('.close')
const targetInstructions = document.querySelector('.rules-text')

targetOpen.addEventListener('click', () => {
    targetOpen.classList.toggle('hidden')
    targetClose.classList.remove('hidden')
    targetInstructions.classList.remove('hidden')
})

targetClose.addEventListener('click', () => {
    targetClose.classList.toggle('hidden')
    targetOpen.classList.remove('hidden')
    targetInstructions.classList.add('hidden')
})