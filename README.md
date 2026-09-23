# Bike to School – Via Verdi, Pavia

Sito per raccogliere **automaticamente** le manifestazioni di interesse delle famiglie per il Bike to School del venerdì. Promosso da Il Sellino Spiritato APS in collaborazione con Comune di Pavia e Via Verdi for Kids.

## Stato attuale

La pagina e il backend per la raccolta automatica sono già nel repository. **Per motivi di riservatezza la raccolta resta disabilitata finché non viene collegato il foglio privato dell'associazione.** Non ci sono mailto, Google Forms né salvataggi di risposte nel repository GitHub. Quando il backend è collegato, il genitore compila il modulo e preme **Invia**; i dati vengono registrati in un foglio privato e una nuova scheda mostra la conferma effettiva rilasciata dal server. Non deve aprire o inviare un'email.

## 1. Attiva GitHub Pages

Nel repository: **Settings → Pages → Build and deployment → Deploy from a branch → main → /(root) → Save**.

Indirizzo previsto dopo l'attivazione: https://cosimolacava-del.github.io/biketoschool/

## 2. Collega l'archivio privato: UNA TANTUM

1. Accedi all'account Google che l'associazione utilizzerà per gestire le risposte. Crea un nuovo **Google Sheet privato**, chiamandolo ad esempio `Bike to School - interessi`. Non renderlo pubblico e non inserire nel repository il suo URL o le risposte.
2. Nel foglio apri **Estensioni → Apps Script**. Elimina il codice di esempio e incolla **integralmente** il contenuto del file [backend/Code.gs](backend/Code.gs). Salva il progetto.
3. Nell'editor di Apps Script, scegli la funzione **setup** dal selettore delle funzioni e premi **Esegui**. Autorizza l'accesso al foglio e la creazione del trigger. Questa operazione crea il tab `Interessi` e un controllo quotidiano che cancella i record oltre 180 giorni.
4. Premi **Distribuisci → Nuovo deployment**. Seleziona il tipo **Applicazione web**. Imposta **Esegui come: Me** (l'account autorizzato dell'associazione) e **Chi può accedere: Chiunque**. Premi Distribuisci, completa le autorizzazioni e copia il link che termina in `/exec`. Quest'ultimo è l'indirizzo pubblico a cui il sito invia le risposte: non identifica il foglio e non concede il permesso di leggerlo.
5. Apri [config.js](config.js) nel repository e sostituisci soltanto il valore `endpoint: ""` con `endpoint: "INCOLLA_QUI_URL_EXEC"` (lascia `delivery: "sheet"`). Salva con un commit.
6. Dal sito pubblicato, fai un invio di prova usando solo dati inventati. In una nuova scheda deve apparire **Ricevuto!** e nel foglio privato deve comparire una nuova riga. Elimina la riga di prova.
7. Da quel momento le famiglie possono inviare i dati automaticamente, senza account Google o email. Per esportare i dati apri il foglio privato: **File → Scarica → Valori separati da virgola (.csv)**.

**Importante:** fino al punto 5 il pulsante del sito rimane disabilitato con un avviso esplicito: nessuna risposta può perdersi silenziosamente. Se in futuro modifichi il backend Apps Script, crea una **nuova versione dello stesso deployment**; il solo aggiornamento del repository GitHub non modifica il codice del backend.

## Protezione dei dati e operatività

- L'utente non deve inserire nomi, cognomi, indirizzi, scuola, classe, foto, dati sanitari o altri dati personali relativi ai bambini. È richiesta solo l'età; associata ai dati del genitore è comunque informazione personale.
- L'archivio va mantenuto privato e accessibile solo alle persone autorizzate dall'associazione. Il Comune e Via Verdi for Kids possono ricevere informazioni aggregate sulla pianificazione, ma **non** devono ricevere automaticamente recapiti o elenchi nominativi.
- Il codice applica una verifica dei campi, limiti di lunghezza, un filtro antispam elementare e una soglia di 3000 righe. Un endpoint pubblicamente accessibile non può eliminare del tutto il rischio di invii indesiderati: controlla periodicamente i dati, ed elimina prontamente gli eventuali contenuti sui minori inseriti per errore.
- `setup()` deve essere stato eseguito con successo per rendere operativo il controllo di conservazione di 180 giorni. Cancella entro gli stessi termini anche email, CSV, esportazioni e copie gestite dall'associazione.
- Prima dell'uso con dati reali, l'associazione deve verificare l'informativa in `privacy.html`, i recapiti indicati, le autorizzazioni interne, le condizioni contrattuali dei servizi utilizzati e la procedura per rispondere alle richieste di accesso, revoca e cancellazione.

## File del progetto

`index.html` pagina e modulo; `style.css` layout; `app.js` validazione e invio automatico; `config.js` URL del servizio privato; `privacy.html` informativa; `backend/Code.gs` codice del backend privato. **Non committare mai risposte, fogli esportati, credenziali o ID di documenti personali.**
