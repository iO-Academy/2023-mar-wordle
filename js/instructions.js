const targetOpenInstructions = document.querySelector('.open')
const targetCloseInstructions = document.querySelector('.close')
const targetInstructions = document.querySelector('.rules-text')
const targetRulesHeader = document.querySelector('.rules-header')


targetRulesHeader.addEventListener('click', () => {
    targetOpenInstructions.classList.toggle('hidden')
    targetCloseInstructions.classList.toggle('hidden')
    targetInstructions.classList.toggle('hidden')
})
