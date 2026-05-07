# KREA Website — Decisioni Architetturali

Memoria stabile delle decisioni architetturali / di prodotto sul sito `krea-website`. Ogni voce ha: Data, Stato, Decisione, Motivo, Impatto.

---

## D-001 — Sito statico vanilla, no framework

**Data:** dedotta dall'avvio del progetto (pre-2026-04)
**Stato:** Attiva

**Decisione:** il sito e' costruito in HTML/CSS/JS puri, multi-pagina. Nessun framework JS (React/Vue/Svelte), nessun SSG (Next/Astro/Eleventy), nessun build step (Webpack/Vite).

**Motivo:** sito brand-vetrina con poche pagine e contenuti relativamente stabili. Un framework aggiungerebbe complessita' di build/deploy senza benefici reali; un build step impedirebbe di aprire le pagine direttamente da filesystem o da static server semplici.

**Impatto:**
- Niente `npm run build` in produzione.
- Le dipendenze in `package.json` (sharp, pdf-parse, pdfjs-dist, serve) sono solo tooling locale.
- Modifiche immediate: edit del file HTML/CSS/JS -> upload su Hostico -> live.

---

## D-002 — Hosting su Hostico (shared PHP) invece di Vercel/Netlify/Pages

**Data:** dedotta dal setup di produzione
**Stato:** Attiva

**Decisione:** il sito e' deployato su **Hostico** (`glc47.hostico.ro`, IP `188.241.222.53`, NS `ns1-4.hostico.ro`), shared hosting PHP rumeno, invece che su piattaforme JAMstack moderne (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

**Motivo:** il form contatti richiede esecuzione **PHP** server-side (`contact-handler.php` con SMTP via `stream_socket_client`). Vercel/Netlify/Pages non eseguono PHP, costringerebbero a riscrivere il form come Function/Worker o ad appoggiarsi a un servizio terzo (Formspree, Resend) — overhead non giustificato per la scala del sito.

**Impatto:**
- Deploy manuale (vedi D-006), niente CI/CD nativo.
- L'hosting fornisce mailbox `amministrazione@krea-audio.com` integrata.
- Eventuale migrazione futura a JAMstack richiederebbe sostituire `contact-handler.php` con una Function.

---

## D-003 — Sottodominio `audiom.` su servizio separato (Google)

**Data:** dedotta dal commit `a91642b` ("Correct Audiom URL from krea.com to krea-audio.com")
**Stato:** Attiva

**Decisione:** `audiom.krea-audio.com` punta via CNAME a `ghs.googlehosted.com` (Google: Sites / Firebase / App Engine / Cloud Run con custom domain). E' un progetto distinto da `krea-website`: questo repo si limita a **linkarlo** dalla nav.

**Motivo:** Audiom e' un'app/strumento con esigenze diverse (dinamico, autenticato o piu' complesso del sito brand). Tenerlo su Google + sottodominio dedicato isola lifecycle, deploy e dipendenze.

**Impatto:**
- Modifiche al sito brand (`krea-audio.com`) NON toccano Audiom.
- Eventuali problemi di Audiom non bloccano il sito brand.
- Il link e' solo testuale (`<a href="https://audiom.krea-audio.com">`) + `dns-prefetch` per latenza.
- `krea-website` NON contiene codice Audiom.

---

## D-004 — Credenziali SMTP fuori dal document root

**Data:** 2026-04-21 (commit `9dfa0eb` "fix: Move SMTP credentials to external config file")
**Stato:** Attiva

**Decisione:** `contact-handler.php` carica user/password SMTP da `mail-config.php` collocato **una directory sopra il document root** (`dirname(__DIR__) . '/mail-config.php'`). Il file NON e' nel repo.

**Motivo:** prima del commit `9dfa0eb` le credenziali erano hardcoded inline nel PHP, finendo committate in chiaro su GitHub (rischio leak credenziali mailbox `amministrazione@krea-audio.com`). Spostarle fuori docroot le rende inaccessibili via HTTP e fuori dal versioning.

**Impatto:**
- `contact-handler.php` da solo NON funziona: in produzione richiede `mail-config.php` adiacente fuori docroot.
- Deploy del solo repo non e' sufficiente: la prima volta, e ad ogni rotazione credenziali, va popolato manualmente `mail-config.php` sul server.
- I commit pre-`9dfa0eb` hanno credenziali in chiaro nella history: vanno **ruotate** se non e' gia' stato fatto.

---

## D-005 — i18n custom invece di libreria esterna

**Data:** dedotta dal codice
**Stato:** Attiva

**Decisione:** internazionalizzazione gestita via `js/i18n.js` custom + attributi `data-i18n` nei tag HTML. Niente i18next, niente libreria esterna.

**Motivo:** scope ridotto (poche stringhe, 2 lingue note IT/EN), coerente con la scelta di sito vanilla senza dipendenze runtime. Aggiungere una libreria significherebbe introdurre un bundler o un import CDN, contro D-001.

**Impatto:**
- Aggiungere una stringa = aggiungere chiave in `i18n.js` + attributo `data-i18n` nell'HTML.
- Aggiungere una lingua = espandere il dizionario in `i18n.js`.
- Niente automazione PO/POT/Crowdin: il dizionario e' codice sorgente.

---

## D-006 — Deploy manuale, niente CI/CD

**Data:** dedotta dall'assenza di `.github/workflows`, `vercel.json`, `netlify.toml`, ecc.
**Stato:** Attiva

**Decisione:** il deploy avviene manualmente (FTP / cPanel / SSH) verso Hostico. Non c'e' GitHub Actions ne' webhook. Il push su `master` NON triggera nessun deploy.

**Motivo:** Hostico shared non ha integrazione Git nativa pratica. Il sito ha frequenza di update bassa (rewrite copy, asset puntuali). L'overhead di settare CI/CD non e' giustificato.

**Impatto:**
- Per pubblicare una modifica: edit -> commit/push (history) -> upload manuale dei file modificati su Hostico.
- Possibile drift fra `master` e prod se l'upload viene saltato. Mitigazione: chi modifica deve sempre uploadare.
- Cambiamento futuro a Vercel/Netlify (vedi D-002) implicherebbe anche introdurre CI/CD; sono decisioni accoppiate.

---

## D-007 — Branch principale `master`, non `main`

**Data:** dedotta dalla configurazione git
**Stato:** Attiva

**Decisione:** il default branch e' `master`. Non e' stato rinominato in `main`.

**Motivo:** repo creato prima della convenzione GitHub `main` di default, e nessuna ragione di prodotto richiede la migrazione. Branch feature/fix vengono mergiati in `master`.

**Impatto:**
- Comandi git riferiscono `origin/master`.
- Nuovi contributor / strumenti che assumono `main` di default vanno orientati esplicitamente.
- Rinominare `master -> main` rompe link/PR/scripts esterni: NON farlo senza task dedicato e comunicato.
