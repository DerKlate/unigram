/**
 * UNIGRAM STUDIO - Core Logic v3.0 (con supporto Immagini)
 * Ottimizzato per feedback istantaneo, persistenza dati e contenuti multimediali.
 */

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT0qEN2SCCtrsWMxCQDxBQwTfBLc4O-VKnjkiE46PJHk3kg7ZXuy56Oyo-ZYASeLIUjr5QMWGdpin1g/pub?output=csv";

const feedContainer = document.getElementById('feed-container');
const bodyElement = document.body;

// Variabili di Stato
let bookmarkedIds = JSON.parse(localStorage.getItem('unigram_bookmarks')) || [];
let toReadIds = JSON.parse(localStorage.getItem('unigram_toread')) || [];
let currentTheme = localStorage.getItem('unigram_theme') || 'dark'; 
let currentFilter = 'all'; 
let lastData = []; // Memoria locale per evitare ricaricamenti inutili

/**
 * 1. Caricamento Dati
 */
function loadData() {
    Papa.parse(SHEET_CSV_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            lastData = results.data; // Salviamo i dati in memoria
            renderFeed(lastData);
        }
    });
}

/**
 * 2. Rendering del Feed
 */
function renderFeed(data) {
    feedContainer.innerHTML = ''; 

    const filteredData = data.filter(row => {
        if (!row.ID_Carosello || !row.Argomento) return false;
        const idStr = String(row.ID_Carosello);
        if (currentFilter === 'bookmarks') return bookmarkedIds.includes(idStr);
        if (currentFilter === 'toread') return toReadIds.includes(idStr);
        return true;
    });

    if (filteredData.length === 0) {
        feedContainer.innerHTML = `<div style="padding:100px 20px; text-align:center; opacity:0.5;">Nessun contenuto trovato.</div>`;
        return;
    }

    filteredData.forEach(row => {
        const idStr = String(row.ID_Carosello);
        let slidesHTML = '';
        
        for (let i = 1; i <= 12; i++) {
            const slideText = row[`Slide_${i}`];
            
            if (slideText && slideText.trim() !== '') {
                let slideContentHTML = '';
                const cleanText = slideText.trim();
                
                // CONTROLLO IMMAGINE: Se il testo inizia con [IMG]
                if (cleanText.startsWith('[IMG]')) {
                    // Rimuoviamo il tag [IMG] per ottenere solo il link
                    const imageUrl = cleanText.replace('[IMG]', '').trim();
                    slideContentHTML = `<img src="${imageUrl}" class="slide-image" alt="Slide ${i} - ${row.Argomento}">`;
                } else {
                    // Altrimenti è un normale testo
                    slideContentHTML = `<div class="slide-content">${cleanText}</div>`;
                }

                slidesHTML += `<div class="swiper-slide">${slideContentHTML}</div>`;
            }
        }

        const isBookmarked = bookmarkedIds.includes(idStr);
        const isToRead = toReadIds.includes(idStr);

        const postHTML = `
            <article class="post" id="post-${idStr}">
                <div class="post-header">
                    <h2>${idStr}. ${row.Argomento}</h2>
                    <div class="post-actions">
                        <button class="action-btn ${isToRead ? 'active-btn toread' : ''}" onclick="toggleToRead('${idStr}', this)">
                            <i data-lucide="${isToRead ? 'book-open-check' : 'book-open'}"></i>
                        </button>
                        <button class="action-btn ${isBookmarked ? 'active-btn bookmarked' : ''}" onclick="toggleBookmark('${idStr}', this)">
                            <i data-lucide="star" ${isBookmarked ? 'fill="currentColor"' : 'fill="none"'}></i>
                        </button>
                    </div>
                </div>
                <div class="swiper mySwiper">
                    <div class="swiper-wrapper">${slidesHTML}</div>
                    <div class="swiper-pagination"></div>
                </div>
            </article>`;
        
        feedContainer.insertAdjacentHTML('beforeend', postHTML);
    });

    initSwiper();
    if (window.lucide) lucide.createIcons();
}

function initSwiper() {
    new Swiper(".mySwiper", {
        pagination: { el: ".swiper-pagination", dynamicBullets: true },
        resistanceRatio: 0.7
    });
}

/**
 * 3. Logica Toggle (Aggiornamento Istantaneo)
 */
window.toggleBookmark = function(id, btnElement) {
    id = String(id);
    if (bookmarkedIds.includes(id)) {
        bookmarkedIds = bookmarkedIds.filter(bId => bId !== id);
    } else {
        bookmarkedIds.push(id);
    }
    localStorage.setItem('unigram_bookmarks', JSON.stringify(bookmarkedIds));
    
    if (currentFilter === 'bookmarks') {
        renderFeed(lastData);
    } else {
        updateButtonIcon(btnElement, bookmarkedIds.includes(id), 'star');
    }
}

window.toggleToRead = function(id, btnElement) {
    id = String(id);
    if (toReadIds.includes(id)) {
        toReadIds = toReadIds.filter(tId => tId !== id);
    } else {
        toReadIds.push(id);
    }
    localStorage.setItem('unigram_toread', JSON.stringify(toReadIds));
    
    if (currentFilter === 'toread') {
        renderFeed(lastData);
    } else {
        updateButtonIcon(btnElement, toReadIds.includes(id), 'book');
    }
}

function updateButtonIcon(btn, isActive, type) {
    if (isActive) {
        btn.classList.add('active-btn');
        if (type === 'star') btn.classList.add('bookmarked');
        if (type === 'book') btn.classList.add('toread');
    } else {
        btn.classList.remove('active-btn', 'bookmarked', 'toread');
    }

    const icon = btn.querySelector('i');
    if (icon) {
        if (type === 'star') {
            icon.setAttribute('fill', isActive ? 'currentColor' : 'none');
        } else {
            icon.setAttribute('data-lucide', isActive ? 'book-open-check' : 'book-open');
        }
    }

    if (window.lucide) lucide.createIcons();
}

/**
 * 4. Menu e Temi
 */
function setupNav() {
    const navMapping = [
        { id: 'btn-tutto', filter: 'all' },
        { id: 'btn-da-leggere', filter: 'toread' },
        { id: 'btn-preferiti', filter: 'bookmarks' }
    ];

    navMapping.forEach(item => {
        const btn = document.getElementById(item.id);
        if (btn) {
            btn.onclick = function(e) {
                e.preventDefault();
                currentFilter = item.filter;
                document.querySelectorAll('.nav-icon').forEach(b => b.classList.remove('nav-icon-active'));
                this.classList.add('nav-icon-active');
                renderFeed(lastData); 
            };
        }
    });

    const btnSettings = document.getElementById('btn-impostazioni');
    if (btnSettings) {
        btnSettings.onclick = function() {
            currentTheme = (currentTheme === 'dark') ? 'light' : 'dark';
            applyTheme(currentTheme);
        };
    }
}

function applyTheme(theme) {
    bodyElement.classList.remove('light-theme', 'dark-theme');
    bodyElement.classList.add(`${theme}-theme`);
    localStorage.setItem('unigram_theme', theme);
    const settingsIcon = document.querySelector('#btn-impostazioni i');
    if (settingsIcon) {
        settingsIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
        if (window.lucide) lucide.createIcons();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
    setupNav();
    loadData();
});