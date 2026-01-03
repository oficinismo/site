card.addEventListener('click', () => {
  const titulo = card.getAttribute('data-titulo');
  const autor = card.getAttribute('data-autor');
  const editorial = card.getAttribute('data-editorial');
  const anio = card.getAttribute('data-anio');
  const precio = card.getAttribute('data-precio');
  const carpeta = card.getAttribute('data-paginas'); // ej: "comic1"

  modalBody.innerHTML = `
    <h2>${titulo}</h2>
    <p><strong>Autor:</strong> ${autor}</p>
    <p><strong>Editorial:</strong> ${editorial}</p>
    <p><strong>Año:</strong> ${anio}</p>
    <p><strong>Precio:</strong> CLP ${precio}</p>
  `;

  // Generar galería simple
  const gallery = document.createElement("div");
  gallery.classList.add("gallery");

  // Suponiendo que cada cómic tiene páginas numeradas 1.jpg, 2.jpg, etc.
  for (let i = 1; i <= 10; i++) { // ajusta el máximo según tu caso
    const img = document.createElement("img");
    img.src = `images/${carpeta}/${i}.jpg`;
    img.onerror = () => img.remove(); // si no existe, se elimina
    img.style.maxWidth = "100%";
    gallery.appendChild(img);
  }

  modalBody.appendChild(gallery);
  modal.style.display = 'flex';
});
