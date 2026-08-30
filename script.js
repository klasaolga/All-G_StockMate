const releaseConfig = Object.freeze({
  status: "available",
  version: "0.9.0-ea.2",
  platform: "Windows 10/11 · 64-bit",
  fileSize: "18.12 MiB",
  sha256: "19DAB70F1541C10608C73EFF20CCA2D47A944242B60D9F0CF65C21C0BB702649",
  downloadUrl: "https://downloads.allgstockmate.com/releases/0.9.0-ea.2/StockMate-0.9.0-ea.2-windows-x64.zip",
  releaseNotesUrl: "https://allgstockmate.com/updates/early-access-free-windows/"
});

// === Localized release UI text ===
const releaseText = Object.freeze(
  document.documentElement.lang.toLowerCase().startsWith("pl")
    ? {
        notAvailableYet: "Jeszcze niedostępne",
        available: "Dostępna",
        comingSoon: "Wkrótce",
        downloadFree: "Pobierz EA Free",
        downloadComingSoon: "Pobieranie wkrótce",
        viewReleaseNotes: "Zobacz informacje o wydaniu"
      }
    : {
        notAvailableYet: "Not available yet",
        available: "Available",
        comingSoon: "Coming soon",
        downloadFree: "Download Free",
        downloadComingSoon: "Download coming soon",
        viewReleaseNotes: "View release notes"
      }
);

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

const displayReleaseValue = (value) => (hasText(value) ? value.trim() : releaseText.notAvailableYet);

if (releaseFields.status) {
  releaseFields.status.textContent = isReleaseAvailable ? releaseText.available : releaseText.comingSoon;
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
    downloadLink.dataset.downloadLocation = "release-section";
    downloadLink.href = releaseConfig.downloadUrl;
    downloadLink.textContent = releaseText.downloadFree;
    releaseFields.action.replaceWith(downloadLink);
  } else {
    const disabledButton = document.createElement("button");
    disabledButton.className = "button primary release-button";
    disabledButton.type = "button";
    disabledButton.dataset.releaseAction = "";
    disabledButton.disabled = true;
    disabledButton.textContent = releaseText.downloadComingSoon;
    releaseFields.action.replaceWith(disabledButton);
  }
}

if (releaseFields.notes) {
  const releaseNotesContainer = releaseFields.notes.closest(".release-notes");

  if (isValidHttpsUrl(releaseConfig.releaseNotesUrl)) {
    const releaseNotesLink = document.createElement("a");
    releaseNotesLink.dataset.releaseNotes = "";
    releaseNotesLink.href = releaseConfig.releaseNotesUrl;
    releaseNotesLink.textContent = releaseText.viewReleaseNotes;
    releaseFields.notes.replaceWith(releaseNotesLink);

    if (releaseNotesContainer) {
      releaseNotesContainer.hidden = false;
    }
  } else {
    releaseFields.notes.textContent = releaseText.notAvailableYet;

    if (releaseNotesContainer) {
      releaseNotesContainer.hidden = true;
    }
  }
}
const trackDownloadClick = (link) => {
  const ctaLocation = link.dataset.downloadLocation;

  if (!hasText(ctaLocation) || typeof window.zaraz?.track !== "function") {
    return;
  }

  try {
    void Promise.resolve(
      window.zaraz.track("stockmate_download_click", {
        release_version: releaseConfig.version.trim(),
        download_platform: "windows-x64",
        cta_location: ctaLocation
      })
    ).catch(() => {});
  } catch {
    // Analytics must never block the download.
  }
};

document.querySelectorAll("a[data-download-location]").forEach((link) => {
  link.addEventListener("click", () => {
    trackDownloadClick(link);
  });
});
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector("#main-navigation");
const navLinks = Array.from(document.querySelectorAll(".main-nav a[href^='#']"));
const navSections = navLinks
  .map((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    return target ? { id: target.id, link, target } : null;
  })
  .filter(Boolean);

const mobileNavQuery = window.matchMedia("(max-width: 720px)");

const setMobileNavOpen = (isOpen, { restoreFocus = false } = {}) => {
  if (!navToggle || !mainNav) {
    return;
  }

  const shouldOpen = mobileNavQuery.matches && isOpen;

  navToggle.setAttribute("aria-expanded", String(shouldOpen));
  mainNav.classList.toggle("is-open", shouldOpen);

  if (restoreFocus) {
    navToggle.focus();
  }
};

if (navToggle && mainNav) {
  setMobileNavOpen(false);

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMobileNavOpen(!isOpen);
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      navToggle.getAttribute("aria-expanded") === "true"
    ) {
      setMobileNavOpen(false, { restoreFocus: true });
    }
  });

  const closeMobileNavForBreakpointChange = () => {
    setMobileNavOpen(false);
  };

  if (typeof mobileNavQuery.addEventListener === "function") {
    mobileNavQuery.addEventListener(
      "change",
      closeMobileNavForBreakpointChange
    );
  } else {
    mobileNavQuery.addListener(closeMobileNavForBreakpointChange);
  }

  document.documentElement.classList.add("js");
}

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
      setMobileNavOpen(false);
      setActiveNavLink(id);
      window.setTimeout(updateActiveNavLink, 180);
    });
  });
}
