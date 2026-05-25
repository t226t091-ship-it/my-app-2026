// DOM Elements
const memoTitleInput = document.getElementById('memoTitle');
const memoContentInput = document.getElementById('memoContent');
const addMemoBtn = document.getElementById('addMemoBtn');
const memoListContainer = document.getElementById('memoList');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');
const fairy = document.getElementById('fairy');
const fairySpeech = document.getElementById('fairySpeech');

// Application State
let memos = [];
const fairyDialogues = [
    "✨ 魔法の時間だよ！",
    "🌸 今日もいい日になるね",
    "🌟 メモを忘れないでね",
    "🍀 何かお手伝いしましょうか？",
    "🌈 素敵なアイデアが浮かぶかも！",
    "🦋 ふわふわ〜、いい気分！",
    "💫 魔法のインクで書いちゃおう",
    "🎵 楽しいことをメモしようね",
    "🔮 未来の自分へのメッセージ？",
    "🍃 風が気持ちいいね"
];
let fairySpeechTimeout;

// Initialize App
function init() {
    loadMemos();
    renderMemos();
    setupEventListeners();
}

// Load memos from localStorage
function loadMemos() {
    const storedMemos = localStorage.getItem('memos');
    if (storedMemos) {
        memos = JSON.parse(storedMemos);
    }
}

// Save memos to localStorage
function saveMemos() {
    localStorage.setItem('memos', JSON.stringify(memos));
}

// Setup Event Listeners
function setupEventListeners() {
    addMemoBtn.addEventListener('click', addMemo);
    searchInput.addEventListener('input', handleSearch);
    
    if (fairy) {
        fairy.addEventListener('click', showFairyDialogue);
    }
}

// Function to show fairy dialogue
function showFairyDialogue() {
    if (!fairySpeech) return;

    // Clear existing timeout if any
    if (fairySpeechTimeout) {
        clearTimeout(fairySpeechTimeout);
    }

    const randomText = fairyDialogues[Math.floor(Math.random() * fairyDialogues.length)];
    fairySpeech.textContent = randomText;
    fairySpeech.classList.add('show');

    // Hide after 3 seconds
    fairySpeechTimeout = setTimeout(() => {
        fairySpeech.classList.remove('show');
    }, 3000);
}

// Add a new memo
function addMemo() {
    const title = memoTitleInput.value.trim();
    const content = memoContentInput.value.trim();

    if (!content) {
        alert('内容を入力してください！');
        return;
    }

    const newMemo = {
        id: Date.now(),
        title: title || '無題のメモ',
        content: content,
        date: new Date().toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    memos.unshift(newMemo);
    saveMemos();
    renderMemos();

    // --- Magic Effects ---
    createMagicParticles();
    triggerAnimalJoy();

    // Clear inputs
    memoTitleInput.value = '';
    memoContentInput.value = '';
}

// Function to create magic particles (stars, sparkles)
function createMagicParticles() {
    const particles = ['✨', '🌟', '🌸', '🍀', '✨'];
    const container = document.body;
    
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'magic-particle';
        p.textContent = particles[Math.floor(Math.random() * particles.length)];
        p.style.left = '50%';
        p.style.top = '40%';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 5 + Math.random() * 10;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        container.appendChild(p);
        
        let posX = window.innerWidth / 2;
        let posY = window.innerHeight * 0.4;
        let opacity = 1;
        
        const animate = () => {
            posX += vx;
            posY += vy;
            opacity -= 0.02;
            
            p.style.left = posX + 'px';
            p.style.top = posY + 'px';
            p.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                p.remove();
            }
        };
        requestAnimationFrame(animate);
    }
}

// Function to make animals "jump" with joy
function triggerAnimalJoy() {
    const animals = document.querySelectorAll('.decoration-layer::before, .decoration-layer::after, .owl, header::before');
    // Note: ::before/::after are harder to animate via JS directly, 
    // so we'll add a class to the container or specific elements
    document.body.classList.add('animals-joy');
    setTimeout(() => {
        document.body.classList.remove('animals-joy');
    }, 1000);
}

// Delete a memo
function deleteMemo(id) {
    if (confirm('このメモを削除してもよろしいですか？')) {
        memos = memos.filter(memo => memo.id !== id);
        saveMemos();
        renderMemos();
    }
}

// Handle Search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    renderMemos(searchTerm);
}

// Render Memos to UI
function renderMemos(filter = '') {
    memoListContainer.innerHTML = '';

    const filteredMemos = memos.filter(memo => 
        memo.title.toLowerCase().includes(filter) || 
        memo.content.toLowerCase().includes(filter)
    );

    if (filteredMemos.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        
        filteredMemos.forEach(memo => {
            const memoCard = document.createElement('div');
            memoCard.className = 'memo-card';
            
            memoCard.innerHTML = `
                <h3>${escapeHTML(memo.title)}</h3>
                <p>${escapeHTML(memo.content)}</p>
                <div class="memo-footer">
                    <span>${memo.date}</span>
                    <button class="delete-btn" onclick="deleteMemo(${memo.id})">削除</button>
                </div>
            `;
            
            memoListContainer.appendChild(memoCard);
        });
    }
}

// Helper to escape HTML and prevent XSS
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Start the app
init();
