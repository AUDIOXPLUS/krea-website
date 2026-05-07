# STATUS.md — KREA Website

Cruscotto operativo. Stato corrente, prossimo task, ticket aperti.

**Ultimo aggiornamento:** 2026-05-07

---

## Stato Corrente

- **Fase:** in produzione, manutenzione.
- **URL live:** [https://krea-audio.com](https://krea-audio.com) (Hostico shared PHP, Romania).
- **Default branch:** `master`.
- **Ultimo commit master:** `9dfa0eb` — *fix: Move SMTP credentials to external config file* (2026-04-21).
- **Pagine attive:** index, philosophy, craftsman, creations, gallery, compare, contact, covenant.
- **Pagine unlisted:** `homeaudio.html` (esiste ma e' stata nascosta dalla nav, vedi commit `d81e23f`).
- **Sottodominio collegato:** `audiom.krea-audio.com` (Google `ghs.googlehosted.com`, repo/deploy separati).
- **CI/CD:** nessuna su GitHub. Deploy avviene tramite cPanel "Git Version Control": repo `Krea1` clonato in `/home/sjspmnch/public_html` (= docroot) e aggiornato con "Update from Remote" (= `git pull origin master`). Trigger del pull non identificato (no cron, no webhook, no Actions). Vedi `KREA_Website_Decisioni.md` D-006.

---

## Prossimo Task

- [ ] **TODO:** definire prossimo lavoro. Nessun task assegnato al momento (Francesco aggiornera' questa sezione quando inizia il prossimo intervento).

---

## Ticket Aperti

Nessun ticket aperto.

| ID | Titolo | Priorita' | Note |
|---|---|---|---|
| — | — | — | — |

---

## Milestone Recenti

Riassunto dal git log recente (ultimi ~25 commit, dal piu' recente):

| Data | Commit | Sintesi |
|---|---|---|
| 2026-04-21 | `9dfa0eb` | SMTP credentials spostate in `mail-config.php` esterno (fuori docroot) |
| — | `22cbf7c` | Switch a SMTP auth per il contact form |
| — | `db3f7a5` | Email sender = `amministrazione@` (rimpiazza `noreply@`) |
| — | `a91642b` | Fix URL Audiom: `krea.com` -> `krea-audio.com` |
| — | `75a5ea3` | Aggiunto link Audiom in nav su tutte le pagine |
| — | `e6dc496` | Aggiunto PHP contact form handler con doppia notifica email |
| — | `d81e23f` | Pagina Home Audio nascosta dalla nav (resta accessibile diretta) |
| — | `4d90555` | Rimossi riferimenti DSP da Home Audio (KREA approva la chain audio) |
| — | `9287036` | Home Audio: sistema modulare, perimetro bassi, integrazione a parete |
| — | `551b501` | Aggiunta pagina Home Audio con design integrato room-speaker |
| — | `0bdfa29`, `ccc0387` | Sezione cestelli CNC multi-parte su Signature/Essential |
| — | `56c98fb` | Ripristinato linguaggio tecnico assertivo nei modali Creations |
| — | `6dd95a9` | Rewrite copy intero sito: tono piu' caldo, human-centered |
| — | `4002248` | Fix link Facebook su tutte le pagine |
| — | `cb0e6cf` | Rewrite pagina Craftsman con background di Francesco e filosofia artigiana |
| — | `2fcbb50` | Fix gallery modali (immagini croppate) |
| — | `9816fd4` | Sostituite immagini philosophy: essential-red, signature-gold, monolite-box |
| — | `0229cba`, `66061d8` | Animazione blur background piu' lenta (4-6s) |

Per cronologia completa: `git -C c:/AI/AUDIO/KREA/krea-website log --oneline`.

---

## Riferimenti Rapidi

- Roadmap: [roadmap_build.md](roadmap_build.md)
- Decisioni: [KREA_Website_Decisioni.md](KREA_Website_Decisioni.md)
- Guida agenti: [AGENTS.md](AGENTS.md)
- Repo: [github.com/AUDIOXPLUS/krea-website](https://github.com/AUDIOXPLUS/krea-website)
- Prod: [krea-audio.com](https://krea-audio.com)
