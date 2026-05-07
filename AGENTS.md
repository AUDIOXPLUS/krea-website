# AGENTS.md — KREA Website Agent Instructions

Questo file e' la guida comune per Claude, Codex/GPT e altri agenti che lavorano nel repo `krea-website`.

`CLAUDE.md` resta solo come shim di compatibilita': le regole canoniche stanno qui.

---

## Identita' Del Progetto

**KREA Website** e' il sito vetrina di **KREA Audio** — diffusori e impianti audio handcrafted in Italia ("Just Listen.").

- **Tipo:** sito statico multi-pagina, no framework, no build step.
- **Stack:** HTML5 + CSS3 + Vanilla JS + i18n custom (`js/i18n.js`) + PHP per il form contatti (`contact-handler.php`, SMTP).
- **Storage:** nessuno. Il sito e' statico; il form contatti invia email via SMTP, niente DB.
- **Repo:** [github.com/AUDIOXPLUS/krea-website](https://github.com/AUDIOXPLUS/krea-website)
- **Default branch:** `master` (NON `main`).
- **Produzione live:** [https://krea-audio.com](https://krea-audio.com) — hosting condiviso PHP **Hostico** (Romania, IP `188.241.222.53`, NS `ns1-4.hostico.ro`). Il sottodominio `audiom.krea-audio.com` e' un servizio **separato** ospitato su Google (CNAME -> `ghs.googlehosted.com`); questo repo lo linka soltanto, non lo gestisce.
- **Owner / persona utente:** Francesco Richichi (AXP). Italian-speaking, preferisce risposte brevi e dirette.

---

## Lettura Iniziale

All'inizio di una sessione normale:

1. Leggi `STATUS.md`.
2. Leggi questo file.
3. Per task di copy / contenuti, consulta i manifesti di brand:
   - `KREA_COVENANT_Manifesto.txt`
   - `KREA_MONOLITE_Engineering_Manifesto.txt`
   - `KREA_SIGNATURE_Engineering_Manifesto-1.txt`
4. Per task UI / pagine, parti dalla pagina HTML rilevante (es. `philosophy.html`, `craftsman.html`, `creations.html`, `homeaudio.html`).
5. Per task i18n, vedi `js/i18n.js` + attributi `data-i18n` nelle pagine.
6. Per task form contatti / mail, vedi `contact-handler.php`. Le credenziali SMTP NON sono in repo: stanno in `mail-config.php` nella directory **sopra** il document root sul server di produzione.

Il prompt corretto in una sessione normale e':

```text
leggi AGENTS.md
```

Walkie Talkie non e' configurato per questo progetto.

---

## Regole Documentazione

| File | Quando aggiornarlo | Cosa ci va | Cosa NON ci va |
|---|---|---|---|
| `README.md` | Raramente (se creato) | Mappa stabile del progetto, link a prod e source of truth | Stato corrente, dettagli sessione |
| `STATUS.md` | A fine task o quando cambia il prossimo passo | Stato vivo, prossimo task, milestone recenti, ticket aperti | Cronologia lunga, roadmap dettagliata |
| `roadmap_build.md` | Quando cambia il piano di lavoro | Fasi, step futuri, dipendenze, ordine di build | Log di sessione o risultati temporanei |
| `KREA_Website_Decisioni.md` | Quando si prende una decisione stabile | Decisione, motivo, impatto | Chat, note temporanee, task esecutivi |
| Pagine HTML (`*.html`) | Quando cambia copy / layout | Struttura semantica + classi CSS coerenti con `css/style.css` | Stili inline lunghi, JS inline complesso |
| `css/style.css` | Quando cambia design system | Variabili CSS, componenti riusabili | Override one-off (meglio classi modificatrici) |
| `js/main.js` | Quando cambia interazione UI | Logica comune (nav, modal, scroll, animazioni) | Logica per pagina specifica (mettila inline o in file dedicato) |
| `js/i18n.js` | Quando si aggiunge una lingua o stringa | Dizionari + attivazione `data-i18n` | Traduzioni inline nelle pagine |
| `contact-handler.php` | Quando cambia il form o l'integrazione SMTP | Validazione input + invio SMTP | Credenziali SMTP (vanno in `mail-config.php` esterno) |

Regola breve: **README mappa, STATUS cruscotto, roadmap piano, Decisioni memoria stabile, manifesti = voce del brand.**

---

## Source Of Truth Tecniche

- **Pagine sito:** `index.html`, `philosophy.html`, `craftsman.html`, `creations.html`, `homeaudio.html` (unlisted nella nav), `gallery.html`, `compare.html`, `contact.html`, `covenant.html`.
- **Stile globale:** `css/style.css`.
- **JS comune:** `js/main.js`.
- **i18n:** `js/i18n.js` + attributi `data-i18n` nelle pagine.
- **Form contatti server-side:** `contact-handler.php` (richiede `mail-config.php` fuori dal docroot).
- **Manifesti di brand (voce / linguaggio):** `KREA_COVENANT_Manifesto.txt`, `KREA_MONOLITE_Engineering_Manifesto.txt`, `KREA_SIGNATURE_Engineering_Manifesto-1.txt`.
- **Asset media:** `images/` (logo, foto prodotto, video hero `krea-hero.mp4`).
- **Dev server locale:** `server.js` (Node, porta 8080, statico con range request per video). Solo per anteprima locale, NON e' il server di produzione.
- **Decisioni:** `KREA_Website_Decisioni.md`.
- **Stato vivo:** `STATUS.md`.

Se `STATUS.md` e `roadmap_build.md` sembrano in conflitto, `STATUS.md` descrive lo stato operativo corrente; aggiorna o segnala il drift invece di duplicare contenuto.

---

## Principi Di Sviluppo

- **Sito statico, vanilla.** Niente framework JS, niente build step, niente bundler. Ogni pagina deve restare apribile direttamente da filesystem o da static server.
- **Nessuna dipendenza npm runtime.** Le dipendenze in `package.json` (sharp, pdf-parse, pdfjs-dist, serve) sono solo tooling locale (estrazione asset, dev server). Niente npm install in produzione.
- **PHP solo per il form contatti.** Non aggiungere logica server-side oltre a quella necessaria per il form. Per qualsiasi backend reale, valuta un servizio separato (vedi sottodominio `audiom.` come precedente).
- **Credenziali fuori dal repo.** Mai committare SMTP user/pass, API key o secret. La config SMTP vive in `mail-config.php` sopra il docroot.
- **i18n via attributi `data-i18n`.** Non hardcodare stringhe direttamente nei tag `<title>`/`<meta>`/contenuto se sono traducibili.
- **Mobile-first sui breakpoint critici.** Verifica sempre il rendering su `< 600px`: il sito e' brand-vetrina, l'esperienza mobile deve essere impeccabile.
- **Voce del brand.** Per copy ed elementi testuali, riferirsi ai manifesti `KREA_*.txt`. Tono: caldo, tecnico, rispettoso del settore, no marketing aggressivo, no DSP.
- **Deploy manuale.** Non c'e' CI/CD: ogni modifica viene caricata su Hostico via FTP / cPanel / SSH. Considera l'impatto pre-merge.
- **Conferma prima di azioni irreversibili.** Push forzato, delete branch, modifica file su prod, drop di config: chiedi prima a Francesco.

---

## Stack Di Riferimento

**Frontend:**
- HTML5 (multi-page, no SSG)
- CSS3 (`css/style.css` come stile globale)
- Vanilla JS (`js/main.js` + `js/i18n.js`)
- Google Fonts (Playfair Display + Inter, caricati da CDN)

**Backend (minimo):**
- PHP per `contact-handler.php` (SMTP raw via `stream_socket_client`)

**Hosting:**
- Hostico shared (PHP + LiteSpeed, Bucarest, Romania)
- Sottodominio `audiom.krea-audio.com` su Google (servizio separato, non in questo repo)

**Tooling locale (opzionale):**
- Node.js (`server.js` come dev server)
- `extract_pdfs.js` / `extract_pdfs.mjs` per processare PDF tecnici offline

---

## Convenzioni Di Comunicazione

- **Lingua:** italiano.
- **Stile:** risposte brevi e dirette. Niente preamboli ("Certo, ecco..."), niente riepiloghi finali ridondanti se l'azione e' visibile dalla diff.
- **Quando e' utile:** tabelle e liste puntate per chiarezza.
- **Path file:** usa il formato cliccabile markdown `[file.html](file.html#L42)` quando referenzi una posizione precisa.
- **Azioni irreversibili:** sempre conferma prima di `git push --force`, `git reset --hard`, `git branch -D`, modifiche dirette su prod, sovrascrittura di asset committati.
- **Lingua del codice:** identificatori, classi CSS e attributi `data-i18n` in inglese; commenti in inglese se brevi e tecnici.
- **Lingua dei contenuti utente-facing:** italiano e inglese (gestiti via i18n).
