// BỔ SUNG: Mở rộng kho thẻ để đủ dùng cho chế độ Khó (16 thẻ = 8 cặp)
const allEmojis = ['🚀', '👽', '🪐', '☄️', '🌟', '🛸', '🛰️', '👨‍🚀'];
let cardsArray = []; 

// Truy xuất DOM
const gameBoard = document.getElementById('game-board');
const movesCountEl = document.getElementById('moves-count');
const resetBtn = document.getElementById('reset-btn');
const winModal = document.getElementById('win-modal');
const playAgainBtn = document.getElementById('play-again-btn');
const finalMovesEl = document.getElementById('final-moves');
// BỔ SUNG: Truy xuất DOM cho Select Cấp độ
const difficultySelect = document.getElementById('difficulty');

let moves = 0;
let matchedPairs = 0;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function initGame() {
    gameBoard.innerHTML = ''; 
    moves = 0;
    matchedPairs = 0;
    movesCountEl.textContent = moves;
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    
    const totalCards = parseInt(difficultySelect.value); // Lấy số 8, 12 hoặc 16
    const pairsNeeded = totalCards / 2; // Số cặp cần thiết (4, 6 hoặc 8)
    
    gameBoard.style.setProperty('--cols', pairsNeeded);
    
    const selectedEmojis = allEmojis.slice(0, pairsNeeded);
    
    cardsArray = [...selectedEmojis, ...selectedEmojis];
    cardsArray = shuffle(cardsArray);

    cardsArray.forEach((item) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = item; 

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${item}</div>
            </div>
        `;

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    updateMoves();
    checkForMatch();
}

function updateMoves() {
    moves++;
    movesCountEl.textContent = moves;
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    matchedPairs++;
    
    if (matchedPairs === cardsArray.length / 2) {
        setTimeout(showWinModal, 500);
    }
    resetBoard();
}

function unflipCards() {
    lockBoard = true; 
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function showWinModal() {
    finalMovesEl.textContent = moves;
    winModal.showModal();
}

// BỔ SUNG: Restart game ngay lập tức nếu người dùng đổi Cấp độ
difficultySelect.addEventListener('change', initGame);

resetBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', () => {
    winModal.close();
    initGame();
});

initGame();