"use strict";
(function () {
  const form = document.getElementById("interest-form");
  if (!form) return;
  const config = window.BIKE_TO_SCHOOL || { delivery: "email", endpoint: "" };
  const status = document.getElementById("form-status");
  const button = document.getElementById("send-button");
  const hint = document.getElementById("send-hint");
  const emailTo = "ilsellinospiritato@gmail.com";
  const isSheet = config.delivery === "sheet";
  const endpointOK = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(config.endpoint || "");
  if (isSheet && endpointOK) {
    button.innerHTML = 'Invia la manifestazione di interesse <span aria-hidden="true">↗</span>';
    hint.textContent = "Si aprirà una nuova scheda con la conferma dell'invio. I dati non saranno pubblicati sul sito.";
  } else if (isSheet) {
    button.disabled = true;
    button.textContent = "Raccolta temporaneamente non disponibile";
    hint.textContent = "Il modulo non è ancora collegato all'archivio riservato: nessun dato può essere inviato.";
    status.textContent = "Configurazione incompleta. Contatta l'associazione via email.";
  }
  function get(name) {
    return String(new FormData(form).get(name) || "").trim();
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.textContent = "";
    const ages = document.getElementById("eta_bambini");
    const ageOK = /^(?:[1-9]|1[0-8])(?:\s*[,;]\s*(?:[1-9]|1[0-8]))*$/.test(ages.value.trim());
    ages.setCustomValidity(ageOK ? "" : "Indica soltanto età da 1 a 18 anni, ad esempio 6 oppure 6, 8.");
    if (!form.reportValidity()) return;
    if (get("website")) {
      status.textContent = "Non è stato possibile elaborare il modulo.";
      return;
    }
    const from = get("partenza");
    // Non escludere i numeri nel nome della via (es. «Via 4 Novembre»).
    // Il modulo chiede esplicitamente di non inserire numeri civici.
    if (isSheet) {
      if (!endpointOK) {
        status.textContent = "L'archivio riservato non è ancora collegato: nessun dato è stato inviato.";
        return;
      }
      let consent = form.querySelector('input[name="consenso_trattamento"]');
      if (!consent) {
        consent = document.createElement("input");
        consent.type = "hidden";
        consent.name = "consenso_trattamento";
        form.appendChild(consent);
      }
      consent.value = "si";
      form.action = config.endpoint;
      form.method = "POST";
      form.target = "_blank";
      status.textContent = "Si aprirà una nuova scheda: controlla il messaggio di conferma prima di chiuderla.";
      HTMLFormElement.prototype.submit.call(form);
      return;
    }
    const body = [
      "Bike to School – Via Verdi | Manifestazione di interesse",
      "",
      "Genitore: " + get("genitore"),
      "Età bambino/a (senza nomi): " + ages.value.trim(),
      "Via o zona di partenza (senza civico): " + from,
      "Orario di ingresso: " + get("ingresso"),
      "Modalità di partecipazione: " + get("modalita"),
      "Recapito del genitore: " + get("contatto"),
      "Note logistiche: " + (get("note") || "Nessuna"),
      "",
      "Confermo di avere letto l'informativa privacy e di acconsentire al trattamento per le finalità organizzative indicate.",
      "Ho compreso che ogni bambino/a deve essere accompagnato da un genitore che pedala con la propria bicicletta.",
      "Questa è soltanto una manifestazione di interesse, senza impegno a partecipare."
    ].join("\n");
    const subject = "Bike to School Via Verdi – manifestazione di interesse";
    status.textContent = "Si aprirà il programma di posta. Verifica l'email precompilata e premi Invia: il modulo da solo non spedisce nulla.";
    window.location.href = "mailto:" + emailTo + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
})();
