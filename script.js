// MENU DO CELULAR

const menuToggle = document.getElementById("menuToggle");
const navlinks = document.getElementById("navlinks");

function closeMenu() {
  navlinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navlinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Fechar menu" : "Abrir menu"
  );
});

// Fecha o menu ao clicar em um link

navlinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

// Fecha o menu ao clicar fora dele

document.addEventListener("click", event => {
  if (
    navlinks.classList.contains("open") &&
    !navlinks.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    closeMenu();
  }
});

// FILTROS DO CATÁLOGO

const products = document.querySelectorAll(".product");
const filterButtons = document.querySelectorAll(".filter");

function filterProducts(category, shouldScroll = true) {

  products.forEach(product => {

    const productCategory = product.dataset.category;

    const shouldShow =
      category === "Todas" ||
      productCategory === category;

    product.hidden = !shouldShow;

  });

  // Atualiza o botão ativo

  filterButtons.forEach(button => {

    const isActive = button.dataset.filter === category;

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));

  });

  // Leva ao catálogo

  if (shouldScroll) {

    document.getElementById("catalogo").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }

}

// Eventos dos filtros

filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    filterProducts(button.dataset.filter, false);

  });

});

// COLEÇÕES FILTRAM O CATÁLOGO

const collectionCards = document.querySelectorAll(".collection-card");

collectionCards.forEach(card => {

  card.addEventListener("click", () => {

    const category = card.dataset.filter;

    filterProducts(category, true);

  });

});

// CONSULTA PELO INSTAGRAM COM MENSAGEM PERSONALIZADA

const instagramDirect = "https://ig.me/m/hamabeads_blueberry";

// Copia a mensagem

async function copyMessage(message) {

  // Tenta usar a função nativa do navegador

  try {

    if (navigator.clipboard && window.isSecureContext) {

      await navigator.clipboard.writeText(message);
      return true;

    }

  } catch (error) {

    console.warn("Clipboard API indisponível. Tentando alternativa.");

  }

  // Método alternativo de cópia

  const textarea = document.createElement("textarea");

  textarea.value = message;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  let copied = false;

  try {

    copied = document.execCommand("copy");

  } catch (error) {

    console.error("Não foi possível copiar a mensagem:", error);

  }

  textarea.remove();

  return copied;

}

// Configura os botões de cada produto

document.querySelectorAll(".product .interest").forEach(link => {

  const product = link.closest(".product");
  const productName = product.querySelector("h3").textContent.trim();

  const message =
    `Olá! Tenho interesse no produto ${productName} da Blueberryshop. Gostaria de saber o valor e a disponibilidade!`;

  // Define o destino do botão

  link.href = instagramDirect;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  link.addEventListener("click", async () => {

    const copied = await copyMessage(message);

    if (copied) {

      alert(
        `Mensagem sobre "${productName}" copiada com sucesso!\n\nAgora é só colar no Direct da Blueberryshop.`
      );

    } else {

      alert(
        `Não foi possível copiar a mensagem automaticamente.\n\nProduto: ${productName}\n\nOlá! Tenho interesse no produto ${productName} da Blueberryshop. Gostaria de saber o valor e a disponibilidade!`
      );

    }

  });

});

// VISUALIZAÇÃO AMPLIADA DAS FOTOS

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDescription = document.getElementById("lightboxDescription");
const lightboxClose = document.getElementById("lightboxClose");

let previousFocus = null;

// Abre a imagem

function openLightbox(button) {

  const image = button.querySelector("img");

  if (!image) return;

  previousFocus = button;

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;

  lightboxTitle.textContent = button.dataset.name;
  lightboxDescription.textContent = button.dataset.description;

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");

  document.body.classList.add("no-scroll");

  lightboxClose.focus();

}

// Fecha a imagem

function closeLightbox() {

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");

  document.body.classList.remove("no-scroll");

  lightboxImage.src = "";
  lightboxImage.alt = "";

  if (previousFocus) {
    previousFocus.focus();
  }

}

// Eventos de abertura

document.querySelectorAll("[data-zoom]").forEach(button => {

  button.addEventListener("click", () => {
    openLightbox(button);
  });

});

// Evento de fechamento

lightboxClose.addEventListener("click", closeLightbox);

// Fecha clicando no fundo

lightbox.addEventListener("click", event => {

  if (event.target === lightbox) {
    closeLightbox();
  }

});

// Fecha com ESC

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {

    if (lightbox.classList.contains("open")) {
      closeLightbox();
    }

    if (navlinks.classList.contains("open")) {
      closeMenu();
    }

  }

});