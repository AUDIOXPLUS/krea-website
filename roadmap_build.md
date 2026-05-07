# KREA Website — Roadmap

Piano di lavoro operativo. Fasi, dipendenze, deliverable.

**Versione:** 1.0
**Data:** 2026-05-07

Sito brand-vetrina di KREA Audio. Statico, vanilla, deploy manuale. Niente backend dinamico oltre al form contatti PHP.

---

## Fase A — Baseline Live (CHIUSA)

**Obiettivo:** sito brand pubblicato e raggiungibile su `krea-audio.com`, con tutte le pagine principali e form contatti funzionante.

**Deliverable raggiunti:**

- [x] Setup hosting Hostico + dominio `krea-audio.com` + email `amministrazione@`.
- [x] Hero animato (`index.html` con video `krea-hero.mp4` + CTA "Just Listen").
- [x] Pagine principali: `philosophy.html`, `craftsman.html`, `creations.html`, `gallery.html`, `compare.html`, `contact.html`, `covenant.html`.
- [x] Stile globale (`css/style.css`) + JS condiviso (`js/main.js`).
- [x] i18n base (`js/i18n.js` + attributi `data-i18n`).
- [x] Form contatti PHP con SMTP (`contact-handler.php`).
- [x] SMTP credentials spostate in `mail-config.php` esterno (sicurezza, commit `9dfa0eb`).
- [x] Manifesti di brand integrati nei testi (`KREA_COVENANT/MONOLITE/SIGNATURE_Manifesto.txt`).
- [x] Pagina Home Audio sviluppata e poi resa unlisted dalla nav (commit `d81e23f`).
- [x] Link Audiom in nav su tutte le pagine (sottodominio Google separato).
- [x] Rewrite copy completo, tono caldo / tecnico / human-centered (commit `6dd95a9`).

---

## Fase B — Manutenzione (in corso)

**Obiettivo:** mantenere il sito allineato a brand, prodotto e canali collegati. Lavori puntuali su copy, asset, fix mobile, integrazioni.

**Step ricorrenti:**

- [ ] Aggiornare copy / asset quando cambia il portafoglio prodotti (Essential, Signature, Monolite, Home Audio).
- [ ] Verificare rendering mobile (`< 600px`) ad ogni modifica strutturale.
- [ ] Mantenere link `audiom.krea-audio.com` e altri link esterni (Facebook, ecc.) coerenti.
- [ ] Monitorare consegna SMTP del form contatti e ruotare credenziali se necessario.
- [ ] Verificare i18n quando si aggiungono pagine o stringhe.

---

## Fase C — Backlog (TODO)

**Obiettivo:** raccogliere idee/migliorie da prioritizzare quando Francesco assegna il prossimo intervento. Niente di committed qui.

**Possibili direzioni (TODO da confermare):**

- [ ] TODO — definire prossimo intervento prioritario.
- [ ] (idea) Performance / Lighthouse: ottimizzazione caricamento video hero, lazy-load immagini gallery.
- [ ] (idea) SEO base: og:image, structured data prodotto, sitemap.xml.
- [ ] (idea) i18n: completare copertura traduzioni se mancano stringhe.
- [ ] (idea) Accessibilita': contrasto, alt text, navigazione tastiera.
- [ ] (idea) Form contatti: rate limiting / captcha lato server (oggi assente).

> Le idee sopra sono spunti dedotti dallo stato corrente, NON commitment. Vanno confermate o scartate da Francesco prima di entrare in Fase B.

---

## Out Of Scope

Espressamente fuori scope per questo repo:

- **CMS dinamico** (WordPress, Strapi, ecc.). Il sito resta statico vanilla.
- **E-commerce / carrello.** KREA non vende online dal sito brand.
- **Backend custom** (Node, Python, Go). L'unica concessione server-side e' `contact-handler.php`.
- **Build pipeline / bundler** (Webpack, Vite, ecc.). Le pagine devono restare apribili direttamente.
- **CI/CD automatico GitHub Actions.** Il deploy oggi avviene via cPanel "Git Version Control" su Hostico (vedi `KREA_Website_Decisioni.md` D-006). Eventuale auto-deploy esplicito (cron `git pull` lato server, GitHub Action che chiama l'API cPanel, o webhook custom) e' una decisione aperta — non in scope di Fase B.
- **Logica `audiom.krea-audio.com`.** E' un servizio separato su Google, ha repo/deploy propri.

---

## Ordine Critico delle Dipendenze

```
hosting Hostico + DNS krea-audio.com
        |
        v
cPanel "Git Version Control" (repo Krea1)
   clone in /home/sjspmnch/public_html
        |
        v
pagine HTML statiche  ->  css/style.css
                      ->  js/main.js
                      ->  js/i18n.js
        |
        v
contact-handler.php  ->  mail-config.php (FUORI dal repo, sul server)
```

Ogni modifica a un nodo richiede regression visiva sulla pagina e, per il form, smoke test SMTP. Dopo ogni push significativo su `master`, verificare HEAD del repo cPanel (`https://krea-audio.com:2083` -> Git Version Control -> Krea1 -> Manage -> HEAD Commit) per confermare che il "Update from Remote" sia avvenuto.

---

*Roadmap v1.0 — Maggio 2026*
