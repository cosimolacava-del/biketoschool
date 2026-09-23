/**
 * Bike to School – Via Verdi: archivio privato opzionale.
 * Incolla questo codice in Apps Script collegato a un Google Sheet PRIVATO.
 * Esegui setup() una sola volta come proprietario del foglio.
 * Pubblica poi come applicazione web: esegui come me, accesso chiunque.
 * NON pubblicare ID del foglio, risposte o credenziali nel repository GitHub.
 */
const TAB = "Interessi";
const HEADER = [
  "Ricevuto il", "Nome genitore", "Età bambino/i", "Via o zona",
  "Ingresso a scuola", "Modalità", "Contatto genitore",
  "Note logistiche", "Consenso", "Cancellazione prevista"
];
const DAYS_TO_KEEP = 180;

function setup() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  if (!book) throw new Error("Apri Apps Script dal foglio: Estensioni > Apps Script.");
  PropertiesService.getScriptProperties().setProperty("PRIVATE_SHEET_ID", book.getId());
  ensureSheet_();
  const found = ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === "purgeExpired");
  if (!found) ScriptApp.newTrigger("purgeExpired").timeBased().everyDays(1).create();
  purgeExpired();
}

function ensureSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty("PRIVATE_SHEET_ID");
  if (!id) throw new Error("Esegui setup() prima di pubblicare l'app web.");
  const book = SpreadsheetApp.openById(id);
  let sheet = book.getSheetByName(TAB);
  if (!sheet) sheet = book.insertSheet(TAB);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER);
    sheet.setFrozenRows(1);
    sheet.getRange("A:A").setNumberFormat("dd/MM/yyyy HH:mm");
    sheet.getRange("J:J").setNumberFormat("dd/MM/yyyy");
  }
  return sheet;
}

function clean_(value, max) {
  return String(value == null ? "" : value).trim().replace(/[\u0000-\u001F\u007F]/g, " ").slice(0, max);
}

function safeCell_(value) {
  // Evita l'interpretazione di testo inserito dall'utente come formula nel foglio.
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function page_(message, good) {
  const color = good ? "#225b4d" : "#a24630";
  const doc = '<!doctype html><html lang="it"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Bike to School – Esito invio</title></head>' +
    '<body style="font-family:system-ui,sans-serif;max-width:580px;margin:9vh auto;padding:24px;color:#123c3a">' +
    '<div style="border-radius:12px;background:#e9f0e5;padding:32px">' +
    '<h1 style="font-size:28px;color:' + color + '">' + (good ? "Ricevuto!" : "Invio non riuscito") + '</h1>' +
    '<p style="font-size:17px;line-height:1.65">' + message + '</p>' +
    '<p style="font-size:13px">Bike to School – Via Verdi · Il Sellino Spiritato APS</p></div></body></html>';
  return HtmlService.createHtmlOutput(doc).setTitle("Bike to School – Invio");
}

function doPost(e) {
  try {
    const p = e && e.parameter || {};
    if (clean_(p.website, 100)) return page_("Non è stato possibile ricevere il modulo.", false);
    if (p.consenso_trattamento !== "si") return page_("È necessario esprimere il consenso al trattamento.", false);
    const parent = clean_(p.genitore, 100);
    const ages = clean_(p.eta_bambini, 32);
    const street = clean_(p.partenza, 90);
    const entry = clean_(p.ingresso, 30);
    const mode = clean_(p.modalita, 100);
    const contact = clean_(p.contatto, 100);
    const notes = clean_(p.note, 250);
    if (!parent || !street || !contact || !/^(?:[1-9]|1[0-8])(?:\s*[,;]\s*(?:[1-9]|1[0-8]))*$/.test(ages)) {
      return page_("Controlla i campi obbligatori e le età indicate; torna al modulo e riprova.", false);
    }
    const validEntry = ["7:30–7:45", "7:45–8:00", "8:00–8:15", "8:15–8:30", "8:30–8:45", "Dopo le 8:45"];
    const validMode = [
      "Bambino/a sulla propria bici, genitore in bici",
      "Bambino/a trasportato/a sulla bici del genitore",
      "Più bambini, modalità differenti", "Da definire"
    ];
    if (!validEntry.includes(entry) || !validMode.includes(mode)) {
      return page_("Controlla la fascia oraria e la modalità di partecipazione.", false);
    }
    const lock = LockService.getScriptLock();
    lock.waitLock(15000);
    try {
      const sheet = ensureSheet_();
      if (sheet.getLastRow() > 3000) return page_("La raccolta è temporaneamente indisponibile; contatta l'associazione.", false);
      const received = new Date();
      const deadline = new Date(received.getTime() + DAYS_TO_KEEP * 24 * 60 * 60 * 1000);
      sheet.appendRow([
        received, safeCell_(parent), safeCell_(ages), safeCell_(street),
        safeCell_(entry), safeCell_(mode), safeCell_(contact),
        safeCell_(notes), "sì", deadline
      ]);
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }
    return page_("La manifestazione di interesse è stata registrata. Non è un'iscrizione e non comporta alcun impegno a partecipare. L'associazione potrà contattarti per aggiornamenti organizzativi.", true);
  } catch (error) {
    // Non esporre dati o dettagli tecnici nella pagina pubblica.
    return page_("Non è stato possibile registrare la manifestazione di interesse. Riprova oppure scrivi a ilsellinospiritato@gmail.com.", false);
  }
}

function purgeExpired() {
  const sheet = ensureSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return;
  const cutoff = Date.now() - DAYS_TO_KEEP * 24 * 60 * 60 * 1000;
  const dates = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (let i = dates.length - 1; i >= 0; i--) {
    const date = dates[i][0];
    if (date instanceof Date && date.getTime() <= cutoff) sheet.deleteRow(i + 2);
  }
}
