const releaseConfig = Object.freeze({
  status: "coming-soon",
  version: null,
  platform: "Windows 10/11 · 64-bit",
  fileSize: null,
  sha256: null,
  downloadUrl: null,
  releaseNotesUrl: null
});

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

const isValidHttpsUrl = (value) => {
  if (!hasText(value)) {
    return false;
  }

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "https:" && Boolean(parsedUrl.hostname);
  } catch {
    return false;
  }
};

const isValidSha256 = (value) => hasText(value) && /^[a-f0-9]{64}$/i.test(value);

const isReleaseAvailable =
  releaseConfig.status === "available" &&
  isValidHttpsUrl(releaseConfig.downloadUrl) &&
  hasText(releaseConfig.version) &&
  hasText(releaseConfig.platform) &&
  hasText(releaseConfig.fileSize) &&
  isValidSha256(releaseConfig.sha256);

const releaseFields = {
  status: document.querySelector("[data-release-status]"),
  version: document.querySelector("[data-release-version]"),
  platform: document.querySelector("[data-release-platform]"),
  fileSize: document.querySelector("[data-release-file-size]"),
  sha256: document.querySelector("[data-release-sha256]"),
  action: document.querySelector("[data-release-action]"),
  notes: document.querySelector("[data-release-notes]")
};

const displayReleaseValue = (value) => (hasText(value) ? value.trim() : "Not available yet");

if (releaseFields.status) {
  releaseFields.status.textContent = isReleaseAvailable ? "Available" : "Coming soon";
  releaseFields.status.classList.toggle("available", isReleaseAvailable);
}

if (releaseFields.version) {
  releaseFields.version.textContent = displayReleaseValue(releaseConfig.version);
}

if (releaseFields.platform) {
  releaseFields.platform.textContent = displayReleaseValue(releaseConfig.platform);
}

if (releaseFields.fileSize) {
  releaseFields.fileSize.textContent = displayReleaseValue(releaseConfig.fileSize);
}

if (releaseFields.sha256) {
  releaseFields.sha256.textContent = displayReleaseValue(releaseConfig.sha256);
}

const optionalReleaseFields = [releaseFields.version, releaseFields.fileSize, releaseFields.sha256];

optionalReleaseFields.forEach((field) => {
  const metadataRow = field?.closest(".release-metadata-row");

  if (metadataRow) {
    metadataRow.hidden = !isReleaseAvailable;
  }
});

if (releaseFields.action) {
  if (isReleaseAvailable) {
    const downloadLink = document.createElement("a");
    downloadLink.className = "button primary release-button";
    downloadLink.dataset.releaseAction = "";
    downloadLink.href = releaseConfig.downloadUrl;
    downloadLink.textContent = `Download Early Access Free ${releaseConfig.version.trim()}`;
    releaseFields.action.replaceWith(downloadLink);
  } else {
    const disabledButton = document.createElement("button");
    disabledButton.className = "button primary release-button";
    disabledButton.type = "button";
    disabledButton.dataset.releaseAction = "";
    disabledButton.disabled = true;
    disabledButton.textContent = "Download coming soon";
    releaseFields.action.replaceWith(disabledButton);
  }
}

if (releaseFields.notes) {
  const releaseNotesContainer = releaseFields.notes.closest(".release-notes");

  if (isValidHttpsUrl(releaseConfig.releaseNotesUrl)) {
    const releaseNotesLink = document.createElement("a");
    releaseNotesLink.dataset.releaseNotes = "";
    releaseNotesLink.href = releaseConfig.releaseNotesUrl;
    releaseNotesLink.textContent = "View release notes";
    releaseFields.notes.replaceWith(releaseNotesLink);

    if (releaseNotesContainer) {
      releaseNotesContainer.hidden = false;
    }
  } else {
    releaseFields.notes.textContent = "Not available yet";

    if (releaseNotesContainer) {
      releaseNotesContainer.hidden = true;
    }
  }
}
const answers = {
  shopTypes:
    "All-G StockMate is being built for small retail shops that need practical stock control: products, deliveries, batches, expiry dates, low-stock checks, stock movements, and corrections. It can fit shops with physical shelves and repeatable stock workflows, whether they sell food, cosmetics, household goods, stationery, accessories, hobby products, or other retail goods.",
  version:
    "Start with EA Free for local stock control in one shop. Standard is planned to add local mobile access, barcode scanning, mobile product creation, invoice photo capture, and OCR. Multiple locations, stock transfers, cloud accounts, synchronization, and remote access belong to Cloud.",
  free:
    "EA Free includes local single-shop use, products, stock levels, deliveries, batches, expiry dates, stock movements, stocktaking, CSV import/export, settings, backups, and up to 2,500 products. It will always stay free.",
  locations:
    "Multiple locations are planned for Cloud, not Standard. Cloud is intended to add location-specific stock levels and stock transfers between locations.",
  dates:
    "Yes. All-G StockMate is being built to support expiry dates and date statuses: known date, missing date, no date information, and not applicable.",
  cloud:
    "Cloud is planned after Standard and is not part of the current Early Access focus. It is intended to add cloud accounts, synchronization, remote access, multiple locations, location stock levels, stock transfers, user roles, and an audit log."
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
