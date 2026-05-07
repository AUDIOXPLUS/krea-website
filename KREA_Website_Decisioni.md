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

**Decisione:** il sito e' deployato su **Hostico** (`glc47.hostico.ro`, IP `188.241.222.53`, NS `ns1-4.hostico.ro`), shared hosting PHP rumeno, invece che su piattaforme JAMstack moderne (Vercel, Netlify, Cloudflare Pages, GitHub Pages). Il document root e' `/home/sjspmnch/public_html` (utente cPanel `sjspmnch`). cPanel tema `jupiter`, accesso `https://krea-audio.com:2083`. Server `Apache` con HTTP/2 (`Upgrade: h2,h2c`).

**Motivo:** il form contatti richiede esecuzione **PHP** server-side (`contact-handler.php` con SMTP via `stream_socket_client`). Vercel/Netlify/Pages non eseguono PHP, costringerebbero a riscrivere il form come Function/Worker o ad appoggiarsi a un servizio terzo (Formspree, Resend) — overhead non giustificato per la scala del sito.

**Impatto:**
- Deploy via cPanel Git Version Control (vedi D-006), niente CI/CD su GitHub.
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

## D-006 — Deploy via cPanel "Git Version Control" sulla working copy del docroot

**Data:** verificata 2026-05-07 sul cPanel di Hostico
**Stato:** Attiva (con un "trigger" non identificato, vedi sotto)

**Decisione:** il deploy NON e' manuale via FTP. Il sito e' una **working copy git** clonata direttamente nel document root tramite la feature **"Git™ Version Control" di cPanel**:

- Nome repo lato cPanel: `Krea1`
- Path locale: `/home/sjspmnch/public_html` (= document root)
- Remote: `https://github.com/AUDIOXPLUS/krea-website.git`
- Branch checked-out: `master`
- Niente `.cpanel.yml` deploy script: i file vengono serviti direttamente dalla working copy, quindi un `git pull` aggiorna istantaneamente cio' che Apache serve
- Aggiornamento avviene cliccando **"Update from Remote"** nel pannello (= `git pull origin master`)

**Verifica empirica (2026-05-07):** HEAD del repo cPanel = `9dfa0eb` = `origin/master`; `Last-Modified` HTTP delle pagine coincide al minuto col timestamp del commit GitHub (es. `philosophy.html` Last-Modified `Tue, 21 Apr 2026 06:43:03 GMT` vs commit `9dfa0eb` autorato `2026-04-21 07:50:07 +0000` = stesso giorno, scarto di un'ora circa).

**Trigger del pull — NON IDENTIFICATO.** Verificate e tutte negative:
- webhook GitHub (`gh api repos/AUDIOXPLUS/krea-website/hooks` = `[]`)
- deploy key (`gh api .../keys` = `[]`)
- GitHub Actions di deploy (esiste solo `pages-build-deployment` residuo, non collegato a Hostico)
- `.cpanel.yml` (assente — il pannello dice "system cannot deploy")
- cron job cPanel ("Nessun processo Cron")
- shell SSH Hostico (disabilitata, warning su "Git Version Control")

Ipotesi residua piu' probabile (non confermata): una **sessione Claude precedente** ha pullato chiamando l'API cPanel (UAPI `VersionControlDeployment::create_pull`) con credenziali fornite dall'utente in passato. Compatibile con il fatto che i commit recenti su `master` sono autorati `Claude <noreply@anthropic.com>` e il messaggio di `9dfa0eb` contiene il link `claude.ai/code/session_014v1wAAhKx8kjfHRYLAJwj7`. **Francesco conferma di non cliccare lui il bottone "Update from Remote".**

**Motivo del setup:** e' la configurazione predefinita di Hostico/cPanel quando si collega un repo GitHub dal pannello. Senza un build step (sito vanilla), il `git pull` nel docroot equivale al deploy.

**Impatto:**
- Per pubblicare una modifica: push su `master` -> qualcuno preme "Update from Remote" in cPanel -> sito live aggiornato. Il "qualcuno" oggi non e' chiaramente attribuito.
- Niente PR-gating del deploy: il merge su master di per se' NON aggiorna il sito. Serve l'azione cPanel.
- Possibile drift latente fra `master` e prod se nessuno preme il bottone. Mitigazione: verificare HEAD del repo cPanel vs origin dopo ogni merge significativo (basta aprire la tab "Pull or Deploy" e controllare HEAD Commit).
- Per rendere il trigger esplicito e tracciabile, opzioni future: cron lato server `git pull`, GitHub Action che chiama l'API cPanel, oppure un webhook custom.

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
