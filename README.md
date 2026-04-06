# 📱 Unigram Studio

## 📖 La Visione: Perché nasce Unigram?
Unigram è una web app mobile-first nata da un'esigenza reale e personale: ottimizzare il tempo di studio di uno studente universitario pendolare, genitore di due figli e neurodivergente (ADHD). 
Studiare su iPad o testi complessi durante brevi tragitti in treno (10-15 minuti) risulta spesso dispersivo. Il cervello con ADHD, tuttavia, apprende in modo estremamente efficiente "al volo", se stimolato correttamente.

**L'idea:** Sfruttare la memoria muscolare e i meccanismi di gratificazione tipici dei social media (nello specifico, Instagram) per creare un feed di micro-learning. Invece di scrollare post a caso, si scrollano "caroselli" di preparazione a un esame a risposta multipla (stile "scuola guida"). Niente distrazioni, altissima leggibilità, zero attrito.

## 🎯 Specifiche del Progetto
* **Tipo di App:** Web App in HTML/CSS/JS "Vanilla" (nessun framework complesso), progettata unicamente per la visualizzazione mobile.
* **UX/UI:** Feed a scorrimento verticale "magnetico" per passare da un argomento all'altro. Scorrimento orizzontale all'interno del singolo argomento per sfogliare le slide.
* **Contenuto:** 30-60 caroselli in ordine fisso. Massimo 10-12 slide per carosello. Testo limitato a circa 180 caratteri per slide per non sovraccaricare l'attenzione.
* **Accessibilità:** Font sans-serif ad alta leggibilità, dimensione adatta alla lettura su smartphone in movimento (18px), contrasto elevato per supportare lievi forme di dislessia.
* **Vincoli Tecnici:** Utilizzo esclusivo di strumenti gratuiti (Google Workspace, GitHub). L'autore ha competenze di programmazione base, quindi il codice deve rimanere pulito, commentato e modulare.

## 🛠️ Stack Tecnologico
* **Frontend:** HTML5, CSS3, JavaScript.
* **Librerie Esterne:**
    * [Swiper.js](https://swiperjs.com/): Per la gestione nativa dei caroselli orizzontali (touch/swipe).
    * [PapaParse](https://www.papaparse.com/): Per la lettura del database in tempo reale.
* **Database (Backend-less):** Google Sheets, pubblicato sul web in formato `.csv`.
* **Hosting e CI/CD:** GitHub Pages con aggiornamento diretto da Visual Studio Code tramite Git locale.
* **Memoria Dati:** `localStorage` del browser per salvare le preferenze dell'utente senza necessità di login o server.

## 💾 Struttura del Database (Google Sheets)
Il sistema è progettato per interfacciarsi con i riassunti generati dall'Intelligenza Artificiale (Google NotebookLM) partendo dai PDF universitari. La struttura fissa delle colonne è:
`ID_Carosello` | `Argomento` | `Slide_1` ... `Slide_12` | `Tipo_Media`

## ✅ Stato Attuale del Progetto
* [x] Setup architettura HTML/CSS/JS.
* [x] Scroll magnetico verticale e swipe orizzontale.
* [x] Integrazione dinamica con database Google Sheets (CSV).
* [x] Pubblicazione online tramite GitHub Pages.
* [x] Creazione della funzione "Preferiti" (salvataggio su dispositivo e filtro visualizzazione).

## 🚀 Prossimi Sviluppi (Roadmap)
* Refactoring estetico per imitare fedelmente l'interfaccia di Instagram.
* Introduzione della funzionalità "Elenco di lettura".
* Stesura del prompt definitivo per NotebookLM.
* Predisposizione del database e del codice per accettare "Reels" (immagini/video).