// 1. INCOLLA QUI IL LINK CHE HAI COPIATO DA GOOGLE SHEETS
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT0qEN2SCCtrsWMxCQDxBQwTfBLc4O-VKnjkiE46PJHk3kg7ZXuy56Oyo-ZYASeLIUjr5QMWGdpin1g/pub?output=csv";

const feedContainer = document.getElementById('feed-container');

// RECUPERO PREFERITI DAL TELEFONO: Cerca nel localStorage, se non c'è nulla crea un array vuoto
let bookmarkedIds = JSON.parse(localStorage.getItem('unigram_bookmarks')) || [];
let showingOnlyBookmarks = false; // Variabile per sapere se stiamo filtrando i preferiti

function loadData() {
    Papa.parse(SHEET_CSV_URL, {
        download: true,
        header: true,
        complete: function(results) {
            renderFeed(results.data);
        }
    });
}

function renderFeed(data) {
    feedContainer.innerHTML = ''; 

    data.forEach(row => {
        if (!row.ID_Carosello || !row.Argomento) return;

        const idStr = String(row.ID_Carosello); // Assicuriamoci che l'ID sia una stringa

        // SE stiamo guardando solo i preferiti e questo ID non è tra i preferiti, saltalo!
        if (showingOnlyBookmarks && !bookmarkedIds.includes(idStr)) return;

        let slidesHTML = '';
        
        for (let i = 1; i <= 12; i++) {
            const slideText = row[`Slide_${i}`];
            if (slideText && slideText.trim() !== '') {
                slidesHTML += `
                    <div class="swiper-slide">
                        <div class="slide-content">${slideText}</div>
                    </div>
                `;
            }
        }

        // Controllo: questo carosello è già nei preferiti?
        const isBookmarked = bookmarkedIds.includes(idStr);
        const starIcon = isBookmarked ? '★' : '☆'; // Stella piena o vuota
        const starClass = isBookmarked ? 'bookmarked' : '';

        const postHTML = `
            <article class="post" id="post-${idStr}">
                <div class="post-header">
                    <h2>${idStr}. ${row.Argomento}</h2>
                    <button class="bookmark-btn ${starClass}" onclick="toggleBookmark('${idStr}', this)">${starIcon}</button>
                </div>
                <div class="swiper mySwiper">
                    <div class="swiper-wrapper">
                        ${slidesHTML}
                    </div>
                    <div class="swiper-pagination"></div>
                </div>
            </article>
        `;
        
        feedContainer.insertAdjacentHTML('beforeend', postHTML);
    });

    initSwiper();
}

function initSwiper() {
    new Swiper(".mySwiper", {
        pagination: { el: ".swiper-pagination", dynamicBullets: true },
    });
}

// IL NUOVO MOTORE DEI PREFERITI
window.toggleBookmark = function(id, btnElement) {
    id = String(id);
    
    if (bookmarkedIds.includes(id)) {
        // Se c'è già, rimuovilo
        bookmarkedIds = bookmarkedIds.filter(bId => bId !== id);
        btnElement.innerText = '☆';
        btnElement.classList.remove('bookmarked');
    } else {
        // Se non c'è, aggiungilo
        bookmarkedIds.push(id);
        btnElement.innerText = '★';
        btnElement.classList.add('bookmarked');
    }
    
    // Salva l'array aggiornato nella memoria del telefono
    localStorage.setItem('unigram_bookmarks', JSON.stringify(bookmarkedIds));
}

// GESTIONE DEL PULSANTE PREFERITI NELLA BARRA IN ALTO
document.getElementById('btn-preferiti').addEventListener('click', function() {
    showingOnlyBookmarks = !showingOnlyBookmarks; // Inverte lo stato
    
    if (showingOnlyBookmarks) {
        this.classList.add('nav-icon-active');
    } else {
        this.classList.remove('nav-icon-active');
    }
    
    // Ricarica il feed applicando il filtro
    loadData();
});

// Avvia l'app
loadData();