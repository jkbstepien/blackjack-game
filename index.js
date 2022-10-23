let deckId
let myScore = 0
let cardsOnTable = 2
let balance = 1000
const deckBtn = document.getElementById("get-deck")
const playBtn = document.getElementById("start-game")
const drawCardBtn = document.getElementById("draw-card")
const cardsContainer = document.getElementById("card-container")
const cardSum = document.getElementById("card-score")
const infoEl = document.getElementById("info")
const deckLoadStatus = document.getElementById("load-deck")
const resultField = document.getElementById("result")
const accountBalance = document.getElementById("account-balance")

async function getDeckId() {
    const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    const data = await response.json()

    deckId = data.deck_id

    deckLoadStatus.textContent = `Obtained deck with ${data.remaining} cards`
    infoEl.textContent = ""
}

deckBtn.addEventListener("click", getDeckId)

playBtn.addEventListener("click", async () => {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    const data = await response.json()

    infoEl.textContent = `Remaining cards in deck: ${data.remaining}`

    cardsContainer.children[0].innerHTML = `
        <img src=${data.cards[0].image} class="card" />
    `
    cardsContainer.children[1].innerHTML = `
        <img src=${data.cards[1].image} class="card" />
    `

    myScore = mapCardValue(data.cards[0].value) + mapCardValue(data.cards[1].value)
    cardSum.textContent = `Score: ${myScore}`
    getResult()
})

function mapCardValue(cardValue) {
    const valueOptions = {
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        "10": 10,
        "JACK": 10,
        "QUEEN": 10,
        "KING": 10,
        "ACE": 11
    }
    return valueOptions[cardValue]
}

async function drawAnotherCard() {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    const data = await response.json()

    infoEl.textContent = `Remaining cards in deck: ${data.remaining}`

    cardsOnTable++

    cardsContainer.innerHTML += `<div class="card-slot"></div>`
    cardsContainer.children[cardsOnTable - 1].innerHTML = `
        <img src=${data.cards[0].image} class="card" />
    `

    myScore += mapCardValue(data.cards[0].value)
    cardSum.textContent = `Score: ${myScore}`
    getResult()
}

drawCardBtn.addEventListener("click", drawAnotherCard)

function getResult() {
    if (myScore <= 17) {
        resultField.textContent = "Win!"
        resultField.style.color = "green"
        balance += 100
        accountBalance.textContent = `Account balance: ${balance}$ (change: +100$)`
    } else {
        resultField.textContent = "Loss!"
        resultField.style.color = "red"
        balance -= 100
        accountBalance.textContent = `Account balance: ${balance}$ (change: -100$)`
    }
}
