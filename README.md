# 📱 Unigram Studio

## 📖 La Visione: Perché nasce Unigram?
Unigram è una web app mobile-first nata da un'esigenza reale: ottimizzare lo studio universitario per profili neurodivergenti (ADHD), genitori e studenti pendolari. 
L'obiettivo è trasformare i tempi morti (10-15 minuti in treno) in sessioni di apprendimento ad alta efficienza, eliminando le distrazioni dei testi complessi.

**L'idea:** Sfruttare la memoria muscolare e i meccanismi di gratificazione dei social (stile Instagram) per creare un feed di micro-learning. Si scorrono "caroselli" didattici anziché post, con altissima leggibilità e zero attrito.

## 🎯 Specifiche del Progetto
* **Tipo di App:** Web App "Vanilla" (HTML/CSS/JS), ottimizzata esclusivamente per dispositivi mobile.
* **UX/UI:** Feed verticale magnetico (Snap Scroll) tra i caroselli e scorrimento orizzontale per le slide interne.
* **Micro-Learning:** 30-60 caroselli in ordine fisso. Massimo 10-12 slide per argomento, con testo limitato a circa 180 caratteri per preservare l'attenzione.
* **Accessibilità:** Font sans-serif (18-22px), contrasto ottimizzato e temi specifici per ridurre l'affaticamento visivo e supportare la dislessia.

## 🛠️ Stack Tecnologico
* **Frontend:** HTML5, CSS3, JavaScript Vanilla.
* **Librerie Esterne:**
    * [Swiper.js](https://swiperjs.com/): Gestione dei caroselli con moduli **Zoom** (pinch-to-zoom) e **Scrollbar**.
    * [PapaParse](https://www.papaparse.com/): Parsing del database CSV in tempo reale.
    * [Lucide Icons](https://lucide.dev/): Icone vettoriali minimaliste.
* **Database:** Google Sheets (pubblicato come .csv).
* **Hosting:** GitHub Pages con distribuzione tramite Git locale.
* **Immagini:** Hosting diretto su GitHub (cartella `/img`) per massime prestazioni e supporto offline.

## 💾 Struttura del Database (Google Sheets)
Il sistema accetta riassunti generati da IA (es. NotebookLM) strutturati in colonne fisse:
`ID_Carosello` | `Argomento` | `Slide_1` ... `Slide_12` | `Tipo_Media`

## ✅ Stato del Progetto

### Fase 1: Architettura Core (Completata)
* [x] Setup HTML/CSS/JS con Scroll Snap verticale.
* [x] Integrazione dinamica con Google Sheets via CSV.
* [x] Funzione "Preferiti" con persistenza in `localStorage`.

### Fase 2: UX Refactoring & Visualizzazione Avanzata (Completata)
* [x] **Visualizzazione Progressiva:** Sostituiti i puntini di navigazione con un contatore a frazione (es. "3 / 10") e una barra di progresso lineare in fondo a ogni post per un feedback immediato sul carico di studio.
* [x] **Supporto Immagini & Zoom:** Implementato il tag `[IMG]` per caricare immagini da GitHub. Aggiunta la funzione **Pinch-to-Zoom** (allargare le dita) e doppio tocco per l'analisi dei dettagli grafici.
* [x] **Segnalibro Intelligente (Single Bookmark):** Trasformazione dell'elenco di lettura in un segnalibro unico. Il sistema ora ricorda l'esatto punto di interruzione e sovrascrive automaticamente il vecchio segnalibro al nuovo click.
* [x] **Navigazione Smart:** * Il tasto **Segnalibro** in alto effettua uno scroll fluido verso la posizione salvata nel feed principale senza filtrare i contenuti.
    * Il tasto **Home** riporta istantaneamente l'utente all'inizio della prima slide del feed.
* [x] **Dual Theme ADHD-Friendly:** Switch rapido tra "Dark Mode" profondo e "Soft Light Mode" (crema/sabbia) per ridurre l'abbagliamento.

## 🚀 Prossimi Sviluppi (Fase 3: Roadmap)
* **Ottimizzazione Prompt:** Affinamento dei prompt per NotebookLM per automatizzare la creazione dei CSV dai PDF universitari.
* **Gamification Leggera:** Indicatori visivi del completamento totale del programma d'esame.
* **PWA (Progressive Web App):** Installazione su home screen e gestione cache per lo studio offline totale.