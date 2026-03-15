// ==================== MODAL ====================

// Selecciona elementos solo si existen
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.getElementById("close");
const cards = document.querySelectorAll(".comic-card");

if (modal && modalBody && closeBtn && cards.length > 0) {
  // Función para abrir modal con datos de la tarjeta
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const titulo = card.getAttribute("data-titulo");
      const autor = card.getAttribute("data-autor");
      const fecha = card.getAttribute("data-fecha");
      const carpeta = card.getAttribute("data-paginas");

      // Contenido textual
      modalBody.innerHTML = `
        <h2>${titulo}</h2>
        <p><strong>Autor:</strong> ${autor}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
      `;

      // Galería de imágenes
      const gallery = document.createElement("div");
      gallery.classList.add("gallery");

      for (let i = 1; i <= 100; i++) {
        const img = document.createElement("img");
        img.src = `catalogo/images/${carpeta}/${i}.jpg`;
        img.onerror = () => {
          img.src = `catalogo/images/${carpeta}/${i}.png`;
          img.onerror = () => img.remove();
        };
        img.style.maxWidth = "90%";
        gallery.appendChild(img);
      }

      modalBody.appendChild(gallery);

      // Botón Buy Me a Coffee
      const donateBtn = document.createElement("a"); 
      donateBtn.href = "https://www.buymeacoffee.com/oficinismo"; 
      donateBtn.target = "_blank"; 
      donateBtn.className = "btn-donar"; 
      donateBtn.textContent = "☕ Si te gusta el contenido, invítame un café";

      donateBtn.addEventListener("click", () => {
        gtag('event', 'donar_click', {
          'event_category': 'Apoyo',
          'event_label': titulo,
          'value': 1
        });
      });

      modalBody.appendChild(donateBtn);

      // Mostrar modal
      modal.style.display = "flex";

      gtag('event', 'comic_open', {
        'event_category': 'Catalogo',
        'event_label': titulo
      });
    });
  });

  // Función para cerrar y limpiar modal
  function cerrarModal() {
    modal.style.display = "none";
    modalBody.innerHTML = "";
  }

  closeBtn.addEventListener("click", cerrarModal);

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      cerrarModal();
    }
  });
}

// ==================== MODO OSCURO ====================

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  // Crear botón si no existe
  let toggle = document.getElementById("theme-toggle");
  if (!toggle) {
    toggle = document.createElement("button");
    toggle.id = "theme-toggle";
    toggle.textContent = "🌙 Modo oscuro";
    toggle.style.position = "fixed";
    toggle.style.bottom = "20px";
    toggle.style.right = "20px";
    toggle.style.padding = "10px 15px";
    toggle.style.borderRadius = "6px";
    toggle.style.border = "none";
    toggle.style.cursor = "pointer";
    toggle.style.background = "var(--link-color)";
    toggle.style.color = "#fff";
    toggle.style.fontWeight = "bold";
    document.body.appendChild(toggle);
  }

  // Cargar preferencia guardada
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
    toggle.textContent = savedTheme === "dark" ? "☀️ Modo claro" : "🌙 Modo oscuro";
  }

  // Alternar tema
  toggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
    toggle.textContent = currentTheme === "dark" ? "☀️ Modo claro" : "🌙 Modo oscuro";
  });
});
