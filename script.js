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
    const editorial = card.getAttribute("data-editorial");
    const anio = card.getAttribute("data-anio");
    const precio = card.getAttribute("data-precio");
    const carpeta = card.getAttribute("data-paginas"); // ej: "comic1"

    // Contenido textual
    modalBody.innerHTML = `
      <h2>${titulo}</h2>
      <p><strong>Autor:</strong> ${autor}</p>
      <p><strong>Editorial:</strong> ${editorial}</p>
      <p><strong>Año:</strong> ${anio}</p>
      <p><strong>Precio:</strong> CLP ${precio}</p>
    `;

    // Galería de imágenes
    const gallery = document.createElement("div");
    gallery.classList.add("gallery");

    // Intentar cargar hasta 20 páginas numeradas
    for (let i = 1; i <= 100; i++) {
      const img = document.createElement("img");
      img.src = `images/${carpeta}/${i}.jpg`;
      img.onerror = () => img.remove(); // si no existe, se elimina
      img.style.maxWidth = "90%";
      gallery.appendChild(img);
    }

    modalBody.appendChild(gallery);

    // Mostrar modal
    modal.style.display = "flex";
  });
});

// Cerrar modal al hacer clic en la X
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

