// 1. INCOLLA QUI IL LINK CHE HAI COPIATO DA GOOGLE SHEETS
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT0qEN2SCCtrsWMxCQDxBQwTfBLc4O-VKnjkiE46PJHk3kg7ZXuy56Oyo-ZYASeLIUjr5QMWGdpin1g/pub?output=csv";

// 2. Troviamo il contenitore dove inserire i post
const feedContainer = document.getElementById('feed-container');

// 3. Funzione per scaricare e leggere i dati
function loadData() {
    Papa.parse(SHEET_CSV_URL, {
        download: true, // Scarica il file dal link
        header: true,   // Usa la prima riga come intestazioni (ID_Carosello, Argomento, ecc.)
        complete: function(results) {
            const data = results.data;
            renderFeed(data); // Quando ha finito, passa i dati per creare l'HTML
        }
    });
}

// 4. Funzione che crea visivamente l'app
function renderFeed(data) {
    feedContainer.innerHTML = ''; // Svuotiamo eventuali caricamenti precedenti

    // Analizziamo ogni riga (carosello) del file Excel
    data.forEach(row => {
        // Se la riga è vuota o manca l'ID, la saltiamo
        if (!row.ID_Carosello || !row.Argomento) return;

        let slidesHTML = '';
        
        // Controlliamo tutte le potenziali 12 slide
        for (let i = 1; i <= 12; i++) {
            const slideText = row[`Slide_${i}`];
            
            // Se la slide contiene testo, creiamo il "pezzettino" di HTML
            if (slideText && slideText.trim() !== '') {
                slidesHTML += `
                    <div class="swiper-slide">
                        <div class="slide-content">${slideText}</div>
                    </div>
                `;
            }
        }

        // Assembliamo l'intero Post (Carosello)
        const postHTML = `
            <article class="post" id="post-${row.ID_Carosello}">
                <div class="post-header">
                    <h2>${row.ID_Carosello}. ${row.Argomento}</h2>
                    <button class="bookmark-btn" onclick="toggleBookmark('${row.ID_Carosello}')">☆</button>
                </div>
                <div class="swiper mySwiper">
                    <div class="swiper-wrapper">
                        ${slidesHTML}
                    </div>
                    <div class="swiper-pagination"></div>
                </div>
            </article>
        `;
        
        // Inseriamo il Post nella pagina
        feedContainer.insertAdjacentHTML('beforeend', postHTML);
    });

    // 5. DOPO aver inserito tutto l'HTML, attiviamo la libreria degli swipe
    initSwiper();
}

function initSwiper() {
    new Swiper(".mySwiper", {
        pagination: {
          el: ".swiper-pagination",
          dynamicBullets: true,
        },
    });
}

// Funzione "finta" per i preferiti (la faremo al prossimo step)
window.toggleBookmark = function(id) {
    alert("Funzione in arrivo! Salveremo il carosello " + id);
}

// 6. Diamo il comando di avvio quando si apre l'app!
loadData();