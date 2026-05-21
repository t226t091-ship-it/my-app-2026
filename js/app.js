// DOM Elements
const memoTitleInput = document.getElementById('memoTitle');
const memoContentInput = document.getElementById('memoContent');
const addMemoBtn = document.getElementById('addMemoBtn');
const memoListContainer = document.getElementById('memoList');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');

// Application State
let memos = [];

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

    // Clear inputs
    memoTitleInput.value = '';
    memoContentInput.value = '';
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
