import {mapCardValue} from "./utils.js";

const deckBtn = document.getElementById("get-deck")
const playBtn = document.getElementById("start-game")
const drawCardBtn = document.getElementById("draw-card")
const resetBtn = document.getElementById("reset")
const cardsContainer = document.getElementById("card-container")
const cardSum = document.getElementById("card-score")
const infoEl = document.getElementById("info")
const resultField = document.getElementById("result")
const accountBalance = document.getElementById("account-balance")

// Get the modal
const modal = document.getElementById("myModal");
const rulesModal = document.getElementById("rulesModal")

const showRulesBtn = document.getElementById("show-rules")

// Get the <span> element that closes the modal
const closeRulesModalBtn = document.getElementsByClassName("close")[0];
const closeModalBtn = document.getElementsByClassName("close")[1];

let deckId
let myScore = 0
let cardsOnTable = 2
let balance = 1000
let isGameWon = true

playBtn.disabled = false
drawCardBtn.disabled = true
resetBtn.disabled = true

async function getDeckId() {
    const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    const data = await response.json()

    deckId = data.deck_id

    infoEl.textContent = ""

    playBtn.disabled = false
    resetBtn.disabled = false
    modal.style.display = "none";
    clearTable();
}

getDeckId().then(r => r.json())

deckBtn.addEventListener("click", getDeckId)

async function startGame() {
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
    accountBalance.textContent = `Account balance: ${balance}$`
    getResult(myScore)

    if (isGameWon) {
        drawCardBtn.disabled = false
    }

    showEndDeckModal(data.remaining)
}

playBtn.addEventListener("click", startGame)

async function drawAnotherCard() {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    const data = await response.json()

    infoEl.textContent = `Remaining cards in deck: ${data.remaining}`

    cardsOnTable++

    cardsContainer.children[cardsOnTable - 1].innerHTML = `
        <img src=${data.cards[0].image} class="card" />
    `

    myScore += mapCardValue(data.cards[0].value)
    cardSum.textContent = `Score: ${myScore}`
    getResult(myScore)
    showEndDeckModal(data.remaining)
}

drawCardBtn.addEventListener("click", drawAnotherCard)

function getResult(score) {
    if (score <= 21) {
        resultField.textContent = "Win!"
        resultField.style.color = "green"
        balance += 100
        playBtn.disabled = true
        isGameWon = true
        accountBalance.textContent = `Account balance: ${balance}$`
    } else {
        resultField.textContent = "Loss!"
        resultField.style.color = "red"
        balance -= 100
        playBtn.disabled = true
        drawCardBtn.disabled = true
        isGameWon = false
        accountBalance.textContent = `Account balance: ${balance}$`
    }
}

function clearTable() {
    cardsContainer.innerHTML = `
            <div class="card-slot"></div>
            <div class="card-slot"></div>
            <div class="card-slot"></div>
            <div class="card-slot"></div>
            <div class="card-slot"></div>
            `
    myScore = 0
    cardsOnTable = 2
    cardSum.textContent = `Score: ${myScore}`
    resultField.textContent = ""

    playBtn.disabled = false
    drawCardBtn.disabled = true
}

resetBtn.addEventListener("click", clearTable)

function showEndDeckModal(remainingCards) {

    if (remainingCards === 0) {
        // When there is no cards left in deck, prompt user.
        modal.style.display = "block"

        // When the user clicks on <button> ("Close"), close the modal.
        closeModalBtn.onclick = function () {
            modal.style.display = "none"
        }

        // When the user clicks anywhere outside the modal, close it.
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none"
            }
        }
    }
}

function showRulesModal() {
    // When user clicks "rules" button make modal visible.
    rulesModal.style.display = "block"

    // When the user clicks on <button> (x), close the modal.
    closeRulesModalBtn.onclick = function () {
        rulesModal.style.display = "none"
    }

    // When the user clicks anywhere outside the modal, close it.
    window.onclick = function (event) {
        if (event.target === modal) {
            rulesModal.style.display = "none"
        }
    }
}

showRulesBtn.addEventListener("click", showRulesModal)
