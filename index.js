const imagePaths = ['img/puzzle1.JPG', 'img/puzzle2.JPG', 'img/puzzle3.JPG'];
let currentImageIndex = 0;
let score = 0;
let imagePath = imagePaths[currentImageIndex];

const container = document.getElementById('puzzle-container');
const wrapper = document.getElementById('wrapper');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalButton = document.getElementById('modal-button');
const hintModal = document.getElementById('hint-modal');
const hintImage = document.querySelector('#hint-modal-content img');
const img = document.getElementById('hidden-image');
const scoreText = document.getElementById('score-text');
const loading = document.getElementById('loading');

const rows = 3;
const cols = 3;
let correctOrder = [];
let selectedPiece = null;

window.onload = () => {
    loadImage(imagePaths[currentImageIndex]);
};

function loadImage(path) {
    imagePath = path;
    hintImage.src = path;
    img.onload = () => {
        loading.style.display = 'none';
        startPuzzle();
    };
    img.src = path;
}

function startPuzzle() {
    modal.style.display = 'none';
    hintModal.style.display = 'none';
    container.innerHTML = '';
    selectedPiece = null;

    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const containerWidth = wrapper.clientWidth;
    const containerHeight = containerWidth / aspectRatio;

    const pieceWidth = containerWidth / cols;
    const pieceHeight = containerHeight / rows;

    container.style.height = containerHeight + 'px';
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${rows}, ${pieceHeight}px)`;

    const pieces = [];
    correctOrder = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.setAttribute('data-index', index);

            piece.style.height = pieceHeight + 'px';
            piece.style.backgroundImage = `url(${imagePath})`;
            piece.style.backgroundSize = `${containerWidth}px ${containerHeight}px`;
            piece.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`;

            pieces.push(piece);
            correctOrder.push(index);
        }
    }

    shuffleArray(pieces);
    pieces.forEach(p => container.appendChild(p));
    enableTapToSwap();
}

function nextPuzzle() {
    modal.style.display = 'none';
    loading.style.display = 'flex';

    if (score >= imagePaths.length) {
        score = 0;
        currentImageIndex = 0;
        updateScoreText();
        modalButton.innerText = 'Lanjutkan';
    } else {
        currentImageIndex = (currentImageIndex + 1) % imagePaths.length;
    }

    loadImage(imagePaths[currentImageIndex]);
}

function enableTapToSwap() {
    const pieces = container.querySelectorAll('.puzzle-piece');
    pieces.forEach(piece => {
        piece.addEventListener('click', () => {
            if (!selectedPiece) {
                selectedPiece = piece;
                piece.style.outline = '2px solid #d63384';
            } else if (selectedPiece === piece) {
                selectedPiece.style.outline = 'none';
                selectedPiece = null;
            } else {
                swapPieces(selectedPiece, piece);
                selectedPiece.style.outline = 'none';
                selectedPiece = null;
                setTimeout(checkPuzzle, 100);
            }
        });
    });
}

function swapPieces(piece1, piece2) {
    const temp = document.createElement('div');
    container.insertBefore(temp, piece1);
    container.insertBefore(piece1, piece2);
    container.insertBefore(piece2, temp);
    container.removeChild(temp);
}

function checkPuzzle() {
    const current = [...container.children].map(p => +p.getAttribute('data-index'));
    const isCorrect = current.every((val, idx) => val === correctOrder[idx]);
    if (isCorrect) {
        score++;
        updateScoreText();

        if (score >= imagePaths.length) {
            modalTitle.innerText = 'Selamat!';
            modalMessage.innerText = 'Kamu selalu bisa menyatukan semuanya.';
            modalButton.innerText = 'Main Lagi';
        } else {
            modalTitle.innerText = 'Yeay! Puzzle Selesai.';
            modalMessage.innerText = 'Kamu berhasil menyelesaikan puzzle ini.';
            modalButton.innerText = 'Lanjutkan';
        }

        modal.style.display = 'flex';
    }
}

function toggleHint() {
    hintModal.style.display = 'flex';
}

function closeHint() {
    hintModal.style.display = 'none';
}

function updateScoreText() {
    scoreText.innerText = `Skor: ${score} / ${imagePaths.length}`;
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}