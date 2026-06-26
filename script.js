const answers = {
  shopTypes:
    "All-G StockMate is being built for small retail shops that need practical stock control: products, deliveries, batches, expiry dates, low-stock checks, corrections, and transfers between locations. It can fit shops with physical shelves and repeatable stock workflows, whether they sell food, cosmetics, household goods, stationery, accessories, hobby products, or other retail goods.",
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
const navLinks = Array.from(document.querySelectorAll(".main-nav a[href^='#']"));
const navSections = navLinks
  .map((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    return target ? { id: target.id, link, target } : null;
  })
  .filter(Boolean);

const setActiveNavLink = (activeId) => {
  navSections.forEach(({ id, link }) => {
    if (id === activeId) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const updateActiveNavLink = () => {
  const header = document.querySelector(".site-header");
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
  const marker = (header?.getBoundingClientRect().height || 0) + Math.min(140, viewportHeight * 0.22);
  let activeId = "";

  navSections.forEach(({ id, target }) => {
    const rect = target.getBoundingClientRect();

    if (rect.top <= marker && rect.bottom > marker) {
      activeId = id;
    }
  });

  if (!activeId) {
    const hashId = window.location.hash.slice(1);
    const hasHashSection = navSections.some(({ id }) => id === hashId);
    activeId = hasHashSection ? hashId : "";
  }

  setActiveNavLink(activeId);
};

if (navSections.length) {
  let navTicking = false;

  const scheduleActiveNavUpdate = () => {
    const schedule =
      typeof window.requestAnimationFrame === "function" ? window.requestAnimationFrame : window.setTimeout;

    schedule(() => {
      updateActiveNavLink();
      navTicking = false;
    });
  };

  updateActiveNavLink();

  window.addEventListener("load", () => {
    updateActiveNavLink();
    window.setTimeout(updateActiveNavLink, 120);
  });

  window.addEventListener(
    "scroll",
    () => {
      if (navTicking) {
        return;
      }

      navTicking = true;
      scheduleActiveNavUpdate();
    },
    { passive: true }
  );

  window.addEventListener("hashchange", () => {
    scheduleActiveNavUpdate();
    window.setTimeout(updateActiveNavLink, 160);
  });

  navSections.forEach(({ id, link }) => {
    link.addEventListener("click", () => {
      setActiveNavLink(id);
      window.setTimeout(updateActiveNavLink, 180);
    });
  });
}

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
