// Selecciona elementos
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.getElementById("close");

// Selecciona todas las tarjetas
const cards = document.querySelectorAll(".comic-card");

// Función para abrir modal con datos de la tarjeta
cards.forEach(card => {
  card.addEventListener("click", () => {
    const titulo = card.getAttribute("data-titulo");
    const autor = card.getAttribute("data-autor");
    const fecha = card.getAttribute("data-fecha");
    const carpeta = card.getAttribute("data-paginas"); // ej: "comic1"

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

    // Primero intentamos con JPG
    img.src = `catalogo/images/${carpeta}/${i}.jpg`;

    // Si falla, probamos con PNG
    img.onerror = () => {
    img.src = `catalogo/images/${carpeta}/${i}.png`;
    img.onerror = () => img.remove(); // si tampoco existe, lo eliminamos
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

    // Evento Analytics al hacer clic en el botón
    donateBtn.addEventListener("click", () => {
      gtag('event', 'donar_click', {
        'event_category': 'Apoyo',
        'event_label': titulo,   // título del cómic
        'value': 1
      });
    });

    modalBody.appendChild(donateBtn);

    // Mostrar modal
    modal.style.display = "flex";

    // Evento Analytics al abrir el modal
    gtag('event', 'comic_open', {
      'event_category': 'Catalogo',
      'event_label': titulo
    });
  });
});


// Función para cerrar y limpiar modal
function cerrarModal() {
  modal.style.display = "none";
  modalBody.innerHTML = ""; // limpia contenido al cerrar
}

// Cerrar modal al hacer clic en la X
closeBtn.addEventListener("click", cerrarModal);

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    cerrarModal();
  }
});

// script.js
const root = document.documentElement;
const toggle = document.createElement("button");

// Configuración inicial del botón
toggle.id = "theme-toggle";
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
toggle.textContent = "🌙 Modo oscuro";

// Insertar el botón en la página
document.body.appendChild(toggle);

// Cargar preferencia guardada
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
  toggle.textContent = savedTheme === "dark" ? "☀️ Modo claro" : "🌙 Modo oscuro";
}

// Alternar tema al hacer clic
toggle.addEventListener("click", () => {
  const currentTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);

  toggle.textContent = currentTheme === "dark" ? "☀️ Modo claro" : "🌙 Modo oscuro";
});

