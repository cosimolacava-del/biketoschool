# Bike to School – Via Verdi, Pavia

Sito dedicato alla **manifestazione di interesse** delle famiglie per il Bike to School del venerdì. Promosso da Il Sellino Spiritato APS in collaborazione con il Comune di Pavia e Via Verdi for Kids.

## 1. Pubblica il sito con GitHub Pages

Nel repository apri **Settings → Pages → Build and deployment**:
- Source: **Deploy from a branch**.
- Branch: **main**, folder: **/(root)**.
- Premi **Save**.

L'indirizzo previsto dopo l'attivazione è `https://cosimolacava-del.github.io/biketoschool/`. Verifica che la pagina risulti effettivamente disponibile prima di condividere il link.

## 2. Modalità già utilizzabile: invio per email

In `config.js` la modalità iniziale è `delivery: "email"`. Dopo aver compilato e validato il modulo, il sito **prepara** un messaggio indirizzato a `ilsellinospiritato@gmail.com`, che il genitore deve inviare dal proprio programma di posta. Il sito non memorizza risposte e non può verificare se l'email sia stata effettivamente inviata. Alcuni dispositivi potrebbero non avere un'app di posta configurata.

**Non affermare che il modulo archivia automaticamente le risposte finché non è attivata la modalità Sheet.**

## 3. Opzionale: archiviazione automatica in un Google Sheet privato

Nessun Google Form è richiesto: il sito resta questo sito GitHub Pages.

1. Crea un nuovo foglio Google **privato**, con accesso limitato alle persone autorizzate dell'associazione. Non pubblicare né condividere pubblicamente il foglio.
2. Dal foglio seleziona **Estensioni → Apps Script** e sostituisci il codice dell'editor con il contenuto di `backend/Code.gs`.
3. Salva. Dall'editor seleziona la funzione `setup` ed eseguila **una volta**; concedi le autorizzazioni necessarie. Questa funzione collega il foglio, crea la scheda `Interessi` e imposta un controllo quotidiano per la cancellazione delle risposte più vecchie di 180 giorni.
4. Seleziona **Distribuisci → Nuovo deployment → Applicazione web**. Imposta **Esegui come: Me** (il proprietario del foglio); **Chi può accedere: Chiunque**. Autorizza il deployment e copia l'URL completo che termina in `/exec`.
5. Modifica `config.js`: `delivery: "sheet"`; incolla l'URL del deployment in `endpoint`, tra virgolette. L'URL di ricezione è pubblico e **non è una password**. Non inserire in GitHub l'ID del foglio, credenziali, indirizzi personali o le risposte.
6. Fai una prova con **dati inventati** dal sito pubblicato. Il click apre una nuova scheda con un messaggio «Ricevuto!» solo quando il server ha registrato il dato. Verifica che compaia la riga nel foglio privato; quindi elimina la riga di prova.
7. Se modifichi in seguito il codice Apps Script, aggiorna anche il **deployment** alla nuova versione; aggiornare GitHub da solo non aggiorna il backend.

### Gestione e sicurezza dei dati

- Il form chiede solo l'età dei bambini, **mai** nomi, indirizzi completi, scuola/classe, fotografie o dati sanitari dei minori. L'età collegata ai dati del genitore è comunque un dato personale.
- Le note sono facoltative e devono contenere solo informazioni logistiche; controlla regolarmente ed elimina prontamente eventuali dati sui minori inseriti per errore.
- La cartella `backend/` contiene soltanto il codice, **non** l'archivio né i dati reali. Non pubblicare mai esportazioni CSV o screenshot del foglio.
- La web app è pubblicamente invocabile: il codice filtra richieste non valide e include un honeypot, ma non può impedire tutti gli invii indesiderati. Controlla periodicamente le risposte.
- Il controllo quotidiano del foglio rimuove i dati dopo 180 giorni **solo se la funzione `setup()` e il relativo trigger sono stati attivati correttamente**. Elimina entro lo stesso termine anche copie CSV, email e backup gestiti dall'associazione.
- Per esportare le risposte, apri il foglio privato e scegli **File → Scarica → Valori separati da virgola (.csv)**. Conserva l'esportazione in posizione riservata.
- Non condividere elenchi nominativi o recapiti con il Comune di Pavia e Via Verdi for Kids senza una distinta valutazione privacy e adeguata informazione agli interessati.

## 4. Informativa e controlli prima della diffusione

La bozza operativa è in `privacy.html`, con Il Sellino Spiritato APS come titolare e `ilsellinospiritato@gmail.com` come contatto. **L'associazione deve verificare prima dell'uso reale** sede/recapiti, autorizzazioni dei membri, tempi di conservazione, condizioni dei fornitori e l'effettiva procedura per revoche e cancellazione; aggiornare l'informativa se cambiano modalità di trattamento o destinatari.

Il checkbox privacy si riferisce soltanto alla raccolta delle manifestazioni di interesse e alle comunicazioni organizzative, non a newsletter o iniziative future.

## File

- `index.html`: pagina iniziale e modulo.
- `style.css`: layout desktop/mobile.
- `app.js`: validazione e invio; non salva i dati in locale.
- `config.js`: selezione della modalità di invio.
- `privacy.html`: informativa privacy.
- `backend/Code.gs`: backend opzionale da incollare in Apps Script legato al foglio privato.
