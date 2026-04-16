/**
 * UNIGRAM STUDIO - Core Logic v3.1 (Supporto Immagini & Stato)
 */

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT0qEN2SCCtrsWMxCQDxBQwTfBLc4O-VKnjkiE46PJHk3kg7ZXuy56Oyo-ZYASeLIUjr5QMWGdpin1g/pub?output=csv";

const feedContainer = document.getElementById('feed-container');
const bodyElement = document.body;

// Variabili di Stato (Persistenza ripristinata)
let bookmarkedIds = JSON.parse(localStorage.getItem('unigram_bookmarks')) || [];
let toReadIds = JSON.parse(localStorage.getItem('unigram_toread')) || [];
let currentTheme = localStorage.getItem('unigram_theme') || 'dark'; 
let currentFilter = 'all'; 
let lastData = []; 

/**
 * 1. Caricamento Dati
 */
function loadData() {
    Papa.parse(SHEET_CSV_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            lastData = results.data; 
            renderFeed(lastData);
        }
    });
}

/**
 * 2. Rendering del Feed con logica Immagini
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
        
        // Ciclo dinamico per le slide (1-12)
        for (let i = 1; i <= 12; i++) {
            const slideText = row[`Slide_${i}`];
            
            if (slideText && slideText.trim() !== '') {
                const cleanText = slideText.trim();
                
                // LOGICA IMMAGINE: Controllo se è un link o ha il tag [IMG]
                const isImageUrl = cleanText.startsWith('http') || cleanText.startsWith('[IMG]');
                
                let slideContentHTML = '';
                if (isImageUrl) {
                    const src = cleanText.replace('[IMG]', '').trim();
                    slideContentHTML = `<img src="${src}" class="slide-image" loading="lazy" alt="Slide ${i} - ${row.Argomento}">`;
                } else {
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
    if (window.lucide) lucide.createIcons(); // Rigenera icone dopo il render
}

function initSwiper() {
    new Swiper(".mySwiper", {
        pagination: { el: ".swiper-pagination", dynamicBullets: true },
        resistanceRatio: 0.7
    });
}

/**
 * 3. Logica Toggle (Preferiti & Lettura)
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
    btn.classList.toggle('active-btn', isActive);
    if (type === 'star') btn.classList.toggle('bookmarked', isActive);
    if (type === 'book') btn.classList.toggle('toread', isActive);

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
 * 4. Navigazione e Temi
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
    if (window.lucide) lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
    setupNav();
    loadData();
});