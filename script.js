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
