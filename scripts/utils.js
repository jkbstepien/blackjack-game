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

export {mapCardValue}