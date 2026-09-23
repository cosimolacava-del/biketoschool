"use strict";
(function () {
  const form = document.getElementById("interest-form");
  if (!form) return;
  const config = window.BIKE_TO_SCHOOL || { delivery: "email", endpoint: "" };
  const status = document.getElementById("form-status");
  const button = document.getElementById("send-button");
  const hint = document.getElementById("send-hint");
  const isSheet = config.delivery === "sheet";
  const endpointOK = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(config.endpoint || "");
  if (isSheet && endpointOK) {
    button.disabled = false;
    button.innerHTML = 'Invia la manifestazione di interesse <span aria-hidden="true">↗</span>';
    hint.textContent = "Premendo Invia, il modulo trasmette automaticamente la risposta all'archivio privato. La conferma della registrazione comparirà nella nuova scheda.";
  } else if (isSheet) {
    button.disabled = true;
    button.textContent = "Raccolta temporaneamente non disponibile";
    hint.textContent = "L'invio automatico sarà disponibile dopo il collegamento all'archivio privato dell'associazione.";
    status.textContent = "Raccolta delle risposte non ancora attiva. Nessun dato è stato trasmesso.";
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
    status.textContent = "L'invio automatico non è ancora disponibile: nessun dato è stato trasmesso.";
  });
})();
