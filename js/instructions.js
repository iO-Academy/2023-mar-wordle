const targetRules = document.querySelector('.rules')
const targetHidden = document.querySelector('.hidden')
const targetClose = document.querySelector('.close')
const targetInstructions = document.querySelector('.instructions')

targetRules.addEventListener('click', removeHiddenClass)
targetClose.addEventListener('click', addHiddenClass)

function removeHiddenClass() {
    targetHidden.classList.remove('hidden')
    targetRules.textContent = 'RULES'
}

function addHiddenClass() {
    targetInstructions.classList.add('hidden')
    targetRules.textContent = 'RULES [+]'
}