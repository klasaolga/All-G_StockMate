const answers = {
  pet:
    "No. The first real-world preset comes from a pet shop, but All-G StockMate is designed for small retail shops in general: pet shops, food shops, specialty stores, boutique retail, and small multi-location shops.",
  version:
    "If you have one location and want basic stock control, start with EA Free. If you manage 2+ locations, transfers, deliveries, batches, and expiry dates, EA Standard is the better fit.",
  free:
    "EA Free includes one location, product database, basic stock control, stocktaking and corrections, CSV import/export, basic filters, and a product limit. It will always stay free.",
  locations:
    "Yes, this is planned for EA Standard. Standard is designed for small retailers that manage 2 or more locations and need to transfer stock between them.",
  dates:
    "Yes. All-G StockMate is being built to support expiry dates and date statuses: known date, missing date, no date information, and not applicable.",
  cloud:
    "Cloud is planned later, but it is not the first Early Access priority. The first focus is EA Free and EA Standard. Cloud should only happen if it is ready and useful enough for real users."
};

const questionButtons = document.querySelectorAll("[data-question]");
const answerBox = document.querySelector("#assistant-answer");

if (answerBox) {
  questionButtons.forEach((button) => {
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
      const key = button.dataset.question;
      const answer = answers[key];

      if (!answer) {
        return;
      }

      questionButtons.forEach((item) => item.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");

      answerBox.replaceChildren();

      const label = document.createElement("strong");
      label.textContent = "StockMate:";

      const text = document.createElement("span");
      text.textContent = ` ${answer}`;

      answerBox.append(label, text);
      answerBox.classList.remove("hidden");
    });
  });
}

const form = document.querySelector("#early-access-form");
const formMessage = document.querySelector("#form-message");

if (form && formMessage) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.classList.remove("hidden");
    form.reset();
  });
}
