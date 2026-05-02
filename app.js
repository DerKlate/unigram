/**
 * UNIGRAM STUDIO - Core Logic v4.0 (Fix Definitivo Scroll Mobile)
 */

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT0qEN2SCCtrsWMxCQDxBQwTfBLc4O-VKnjkiE46PJHk3kg7ZXuy56Oyo-ZYASeLIUjr5QMWGdpin1g/pub?output=csv";

const feedContainer = document.getElementById('feed-container');
const bodyElement = document.body;

let bookmarkedIds = JSON.parse(localStorage.getItem('unigram_bookmarks')) || [];
let savedBookmarkId = localStorage.getItem('unigram_active_bookmark') || null; 
let currentTheme = localStorage.getItem('unigram_theme') || 'dark'; 
let currentFilter = 'all'; // I filtri ora sono SOLO 'all' e 'bookmarks'
let lastData = []; 

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

function renderFeed(data) {
    feedContainer.innerHTML = ''; 

    const filteredData = data.filter(row => {
        if (!row.ID_Carosello || !row.Argomento) return false;
        const idStr = String(row.ID_Carosello);
        if (currentFilter === 'bookmarks') return bookmarkedIds.includes(idStr);
        // Nessun filtro "toread" qui. Se siamo in "all", mostra tutto.
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
                const cleanText = slideText.trim();
                const isImageUrl = cleanText.startsWith('http') || cleanText.startsWith('[IMG]') || cleanText.startsWith('img/');
                
                let slideContentHTML = '';
                if (isImageUrl) {
                    const src = cleanText.replace('[IMG]', '').trim();
                    slideContentHTML = `
                        <div class="swiper-zoom-container">
                            <img src="${src}" class="slide-image" loading="lazy">
                        </div>`;
                } else {
                    slideContentHTML = `<div class="slide-content">${cleanText}</div>`;
                }
                slidesHTML += `<div class="swiper-slide">${slideContentHTML}</div>`;
            }
        }

        const isBookmarked = bookmarkedIds.includes(idStr);
        const isToRead = (idStr === savedBookmarkId);

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
                    <div class="swiper-scrollbar"></div>
                </div>
            </article>`;
        
        feedContainer.insertAdjacentHTML('beforeend', postHTML);
    });

    initSwiper();
    if (window.lucide) lucide.createIcons();
}

function initSwiper() {
    new Swiper(".mySwiper", {
        pagination: { 
            el: ".swiper-pagination", 
            type: "fraction",
            renderFraction: function (currentClass, totalClass) {
                return '<span class="' + currentClass + '"></span> <span class="sep">/</span> <span class="' + totalClass + '"></span>';
            }
        },
        scrollbar: { el: ".swiper-scrollbar", hide: false, draggable: true },
        resistanceRatio: 0.7,
        zoom: { maxRatio: 3, minRatio: 1, toggle: true }
    });
}

window.toggleBookmark = function(id, btnElement) {
    id = String(id);
    if (bookmarkedIds.includes(id)) {
        bookmarkedIds = bookmarkedIds.filter(bId => bId !== id);
    } else {
        bookmarkedIds.push(id);
    }
    localStorage.setItem('unigram_bookmarks', JSON.stringify(bookmarkedIds));
    if (currentFilter === 'bookmarks') renderFeed(lastData);
    else updateButtonIcon(btnElement, bookmarkedIds.includes(id), 'star');
}

window.toggleToRead = function(id, btnElement) {
    id = String(id);
    const isRemoving = (savedBookmarkId === id);
    
    if (isRemoving) {
        savedBookmarkId = null;
    } else {
        savedBookmarkId = id;
    }
    
    localStorage.setItem('unigram_active_bookmark', savedBookmarkId || '');

    // Aggiorna solo visivamente i pulsanti, senza ricaricare la pagina
    document.querySelectorAll('.post').forEach(post => {
        const postId = post.id.replace('post-', '');
        const btn = post.querySelector('button[onclick^="toggleToRead"]');
        if (btn) {
            const isActive = (postId === savedBookmarkId);
            btn.classList.toggle('active-btn', isActive);
            btn.classList.toggle('toread', isActive);
            const icon = btn.querySelector('i');
            if (icon) icon.setAttribute('data-lucide', isActive ? 'book-open-check' : 'book-open');
        }
    });
    if (window.lucide) lucide.createIcons();
}

function updateButtonIcon(btn, isActive, type) {
    btn.classList.toggle('active-btn', isActive);
    if (type === 'star') btn.classList.toggle('bookmarked', isActive);
    if (type === 'book') btn.classList.toggle('toread', isActive);
    const icon = btn.querySelector('i');
    if (icon) {
        if (type === 'star') icon.setAttribute('fill', isActive ? 'currentColor' : 'none');
        else icon.setAttribute('data-lucide', isActive ? 'book-open-check' : 'book-open');
    }
    if (window.lucide) lucide.createIcons();
}

function setupNav() {
    const btnTutto = document.getElementById('btn-tutto');
    const btnSegnalibro = document.getElementById('btn-da-leggere'); 
    const btnPreferiti = document.getElementById('btn-preferiti');

    const scrollToBookmark = () => {
        if (savedBookmarkId) {
            const target = document.getElementById(`post-${savedBookmarkId}`);
            if (target) {
                // Sblocca lo snap di Safari per permettere lo scorrimento
                feedContainer.style.scrollSnapType = 'none';
                feedContainer.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
                
                // Lo riattiva dopo l'animazione
                setTimeout(() => {
                    feedContainer.style.scrollSnapType = 'y mandatory';
                }, 800);
            }
        } else {
            alert("Nessun segnalibro salvato! Clicca l'icona del libro su un carosello per salvarlo.");
        }
    };

    if (btnTutto) {
        btnTutto.onclick = function(e) {
            e.preventDefault();
            if (currentFilter !== 'all') {
                currentFilter = 'all';
                renderFeed(lastData);
            }
            document.querySelectorAll('.nav-icon').forEach(b => b.classList.remove('nav-icon-active'));
            this.classList.add('nav-icon-active');
            
            feedContainer.style.scrollSnapType = 'none';
            feedContainer.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => { feedContainer.style.scrollSnapType = 'y mandatory'; }, 800);
        };
    }

    if (btnSegnalibro) {
        btnSegnalibro.onclick = function(e) {
            e.preventDefault();
            
            // Il segnalibro NON filtra più. Assicura che la home sia attiva.
            if (currentFilter !== 'all') {
                currentFilter = 'all';
                renderFeed(lastData);
            }
            
            // L'icona attiva nella navbar resta quella della Home (perché non stiamo filtrando)
            document.querySelectorAll('.nav-icon').forEach(b => b.classList.remove('nav-icon-active'));
            btnTutto.classList.add('nav-icon-active'); 
            
            setTimeout(scrollToBookmark, 200);
        };
    }

    if (btnPreferiti) {
        btnPreferiti.onclick = function(e) {
            e.preventDefault();
            currentFilter = 'bookmarks';
            document.querySelectorAll('.nav-icon').forEach(b => b.classList.remove('nav-icon-active'));
            this.classList.add('nav-icon-active');
            renderFeed(lastData);
            feedContainer.scrollTo({ top: 0, behavior: 'auto' });
        };
    }

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