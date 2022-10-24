import {mapCardValue} from "./utils.js";

const deckBtn = document.getElementById("get-deck")
const playBtn = document.getElementById("start-game")
const drawCardBtn = document.getElementById("draw-card")
const resetBtn = document.getElementById("reset")
const cardsContainer = document.getElementById("card-container")
const cardSum = document.getElementById("card-score")
const infoEl = document.getElementById("info")
const deckLoadStatus = document.getElementById("load-deck")
const resultField = document.getElementById("result")
const accountBalance = document.getElementById("account-balance")

let deckId
let myScore = 0
let cardsOnTable = 2
let balance = 1000
let isGameWon = true

playBtn.disabled = true
drawCardBtn.disabled = true
resetBtn.disabled = true

async function getDeckId() {
    const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    const data = await response.json()

    deckId = data.deck_id

    deckLoadStatus.textContent = `Obtained deck with ${data.remaining} cards`
    infoEl.textContent = ""

    playBtn.disabled = false
    resetBtn.disabled = false
}

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
}

playBtn.addEventListener("click", startGame)

async function drawAnotherCard() {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    const data = await response.json()

    infoEl.textContent = `Remaining cards in deck: ${data.remaining}`

    cardsOnTable++

    console.log(cardsContainer.children)
    // cardsContainer.innerHTML += `<div class="card-slot"></div>`
    cardsContainer.children[cardsOnTable - 1].innerHTML = `
        <img src=${data.cards[0].image} class="card" />
    `

    myScore += mapCardValue(data.cards[0].value)
    cardSum.textContent = `Score: ${myScore}`
    getResult(myScore)
    console.log(data.card[0].value)
}

drawCardBtn.addEventListener("click", drawAnotherCard)

function getResult(score) {
    if (score <= 17) {
        resultField.textContent = "Win!"
        resultField.style.color = "green"
        balance += 100
        playBtn.disabled = true
        isGameWon = true
    } else {
        resultField.textContent = "Loss!"
        resultField.style.color = "red"
        balance -= 100
        playBtn.disabled = true
        drawCardBtn.disabled = true
        isGameWon = false
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
    accountBalance.textContent = `Account balance: ${balance}$`
    resultField.textContent = ""

    playBtn.disabled = false
    drawCardBtn.disabled = true
}

resetBtn.addEventListener("click", clearTable)
