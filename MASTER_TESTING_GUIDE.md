# MASTER TESTING GUIDE - MGVACANZE (Pre-Flight Checklist)

Questo documento serve come "lista di controllo finale" prima del deploy su Hostinger. Esegui ogni punto sequenzialmente.

## 🔴 1. Core Authentication Flow (CRITICO)
*Il sito è inutile se gli utenti non possono entrare.*

- [ ] **Registrazione (Email/Password):**
    - Crea un nuovo utente con email reale.
    - Verifica che il redirect post-registrazione vada su `/` o `/login` con messaggio "controlla email".
    - Controlla che il record appaia in Supabase `auth.users` e `public.profiles`.
- [ ] **Login Standard:**
    - Login con credenziali corrette -> Redirect a `/account` o Home.
    - Login con credenziali errate -> Errore visibile in UI (non solo console).
- [ ] **Email Confirmation / Magic Link:**
    - Richiedi mail di conferma.
    - Clicca sul link da: PC (Chrome), Mobile (Safari/Chrome).
    - **Verifica:** Nessun errore "Code Challenge" (Fix applicato in `route.ts`).
    - **Verifica:** Sessione attiva e cookie presenti dopo il click.
- [ ] **Logout:**
    - Clicca Logout -> Redirect alla Home -> Tasto "Accedi" visibile di nuovo.
- [ ] **Password Reset:**
    - Flusso "Password Dimenticata" -> Ricezione Mail -> Cambio Password -> Login con nuova password.

## 🛥️ 2. Flusso Noleggio & Barche (Booking Engine)
- [ ] **Lista Barche (Fleet Page):**
    - Caricamento di tutte le card.
    - Funzionamento filtri (se presenti).
    - Immagini caricate correttamente (Next/Image ottimizzato, niente layout shift).
- [ ] **Dettaglio Barca (Dynamic Slug):**
    - Naviga su una barca (es. `/boat/elyvian-breeze`).
    - Controlla: Titolo, Descrizione, Gallery Immagini (Lightbox apre?), Specifiche tecniche.
- [ ] **Booking Form:**
    - Compila il form di richiesta preventivo/prenotazione.
    - **Submit:** Verifica che i dati arrivino su Supabase (tabella `bookings` o simile).
    - **Feedback:** L'utente vede un messaggio di successo ("Grazie, ti contatteremo...").
    - **Email Admin:** (Opzionale) Verifica se parte la mail di notifica all'admin.

## 🗺️ 3. Itinerari & Pagine Statiche
- [ ] **Pagina Itinerari:**
    - Timeline o mappa visualizzate correttamente.
    - Clic su tappe itinerario (se interattive).
- [ ] **Pagine Informative:**
    - `/contact`: Invio form contatti generico.
    - `/terms` e `/privacy-policy`: Devono esistere e contenere testo legale.

## 👮 4. Area Admin & Protezione Route
- [ ] **Accesso non autorizzato:**
    - Prova ad accedere a `/admin/dashboard` da loggato come USER normale -> Deve reindirizzare o dare 403.
    - Prova ad accedere a `/admin/dashboard` da sloggato -> Redirect login.
- [ ] **Dashboard Admin:**
    - Login come admin (verifica ruolo su Supabase).
    - Visualizzi la lista prenotazioni?
    - Le azioni (Modifica/Cancella) funzionano?

## 🌍 5. Internationalization (i18n)
- [ ] **Switch Lingua:**
    - Cambia da IT a EN. L'URL cambia (es. `/en/...`) o usa cookie?
    - La sessione Auth rimane attiva cambiando lingua?
- [ ] **Traduzioni Mancanti:**
    - Naviga le pagine chiave in INGLESE. Cerca testi rimasti in italiano hardcoded.
    - Controlla date e valute formattate (es. € vs EUR, dd/mm/yyyy).

## 🚀 6. Performance & Tech Check
- [ ] **Build Check:**
    - Esegui `npm run build` in locale. **DEVE** essere verde senza errori.
- [ ] **Console Errors:**
    - Apri DevTools (F12). Naviga tutto il sito.
    - **Rosso:** Errori React, Hyderation Mismatch, 404 immagini, Errori API. (NON DEVONO ESSERCI).
    - **Giallo:** Warning (es. `key` prop missing). Cerca di risolverli.
- [ ] **Responsive Design:**
    - Controlla Home e Booking Form su Mobile (375px width). I bottoni sono cliccabili? Il menu si apre?

## 🛡️ 7. Supabase Production Settings
- [ ] **Site URL:** Su Supabase Auth Settings, rimuovi `localhost:3000` e metti `https://mgvacanze.com`.
- [ ] **Redirect URLs:** Aggiungi `https://mgvacanze.com/auth/callback` e `https://www.mgvacanze.com/auth/callback`.
- [ ] **SMTP:** Verifica che l'SMTP personalizzato sia attivo e non quello di default di Supabase (limite 3 mail/ora).

## ☁️ 8. Deploy Checklist (Post-Upload)
- [ ] Variabili d'Ambiente (`.env.production`):
    - `NEXT_PUBLIC_SITE_URL` puntato al dominio vero.
    - `NEXT_PUBLIC_SUPABASE_URL` e KEY corretti.
- [ ] DNS:
    - Dominio (SiteGround) puntato correttamente ai nameserver o A Record di Hostinger.
