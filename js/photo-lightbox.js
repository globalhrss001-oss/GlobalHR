(function () {
  var CARD_SELECTORS = [
    "#arrival-service article",
    "#gallery figure",
    "#history figure",
    "#licences figure",
    "#programs .training-program-gallery figure",
  ].join(", ");

  var overlay = null;
  var overlayImg = null;
  var overlayCaption = null;
  var lastFocus = null;

  function getCaption(card) {
    var h3 = card.querySelector("h3");
    if (h3) return h3.textContent.trim();
    var cap = card.querySelector("figcaption");
    if (cap) return cap.textContent.trim();
    var img = card.querySelector("img");
    return img && img.alt ? img.alt : "";
  }

  function ensureOverlay() {
    if (overlay) return;

    overlay = document.createElement("div");
    overlay.className = "photo-lightbox-overlay";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Photo preview");

    var dialog = document.createElement("div");
    dialog.className = "photo-lightbox-dialog";

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "photo-lightbox-close";
    closeBtn.setAttribute("aria-label", "Close photo preview");
    closeBtn.innerHTML = "&times;";

    overlayImg = document.createElement("img");
    overlayImg.className = "photo-lightbox-img";
    overlayImg.decoding = "async";

    overlayCaption = document.createElement("p");
    overlayCaption.className = "photo-lightbox-caption";

    dialog.appendChild(closeBtn);
    dialog.appendChild(overlayImg);
    dialog.appendChild(overlayCaption);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    closeBtn.addEventListener("click", closeLightbox);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay && !overlay.hidden) closeLightbox();
    });
  }

  function openLightbox(src, alt, caption) {
    ensureOverlay();
    lastFocus = document.activeElement;
    overlayImg.src = src;
    overlayImg.alt = alt || "";
    overlayCaption.textContent = caption || alt || "";
    overlayCaption.hidden = !overlayCaption.textContent;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    overlay.querySelector(".photo-lightbox-close").focus();
  }

  function closeLightbox() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    overlayImg.removeAttribute("src");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function bindCard(card) {
    var img = card.querySelector("img");
    if (!img || !img.getAttribute("src")) return;

    card.classList.add("photo-lightbox-card");
    if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      "View larger photo: " + (getCaption(card) || img.alt || "photo")
    );

    function show() {
      openLightbox(img.currentSrc || img.src, img.alt, getCaption(card));
    }

    card.addEventListener("click", show);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        show();
      }
    });
  }

  function initPhotoLightbox() {
    document.querySelectorAll(CARD_SELECTORS).forEach(bindCard);
  }

  window.initPhotoLightbox = initPhotoLightbox;
})();
