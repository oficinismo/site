/* ============================
   Variables globales
============================ */
let images = [];
let currentIndex = 0;
let carrito = [];
let total = 0;

/* ============================
   Carrito de compras
============================ */
function agregarAlCarrito(nombre, precio) {
    const talla = document.getElementById("tallaSelect").value; // selector en el modal

    const itemExistente = carrito.find(item => item.nombre === nombre && item.talla === talla);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1, talla });
    }
    total += precio;
    actualizarCarrito();
}

function eliminarDelCarrito(nombre, talla) {
    const itemIndex = carrito.findIndex(item => item.nombre === nombre && item.talla === talla);

    if (itemIndex !== -1) {
        total -= carrito[itemIndex].precio;
        if (carrito[itemIndex].cantidad > 1) {
            carrito[itemIndex].cantidad--;
        } else {
            carrito.splice(itemIndex, 1);
        }
        actualizarCarrito();
    }
}

function actualizarCarrito() {
    const lista = document.getElementById("listaCarrito");
    const totalElemento = document.getElementById("total");
    const carritoTexto = [];

    lista.innerHTML = "";

    carrito.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("cart-item");
        li.innerHTML = `
          <span>${item.nombre} - Talla: ${item.talla} - CLP ${item.precio} (Cantidad: ${item.cantidad})</span>
          <button onclick="eliminarDelCarrito('${item.nombre}', '${item.talla}')">🗑️</button>
        `;
        lista.appendChild(li);

        carritoTexto.push(`${item.nombre} (Talla: ${item.talla}) - CLP ${item.precio} (Cantidad: ${item.cantidad})`);
    });

    // Actualiza el total visible en el modal
    totalElemento.textContent = total;

    // Actualiza también el formulario de contacto
    document.getElementById("totalVisible").textContent = total;
    document.getElementById("detalleVisible").innerHTML = carritoTexto.join('<br>');
    document.getElementById("carrito").value = carritoTexto.join(', ');
    document.getElementById("detallesPedido").value = carritoTexto.join('\n');
    document.getElementById("totalPedido").value = total;

    // 👇 Actualiza el badge del botón flotante
    document.getElementById("cart-count").textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
}

/* ============================
   Modal de producto
============================ */
function mostrarInfo(el) {
    const d = el.dataset;

    // Imagen principal
    document.getElementById('imgModal').src = d.cover;

    // Info textual
    document.getElementById("modalProducto").textContent = d.producto;
    document.getElementById("modalCategoria").textContent = d.categoria;
    document.getElementById("modalDimensiones").textContent = "Dimensiones: " + d.dimensiones;
    document.getElementById('modalDescription').textContent = d.descripcion;
    document.getElementById('modalPrice').textContent = "Precio: $" + d.precio;

    // Navegación de imágenes
    images = [d.cover, d.back].filter(src => src && src !== "");
    currentIndex = 0;

    checkButtons();
    document.getElementById('prevBtn').onclick = prevImage;
    document.getElementById('nextBtn').onclick = nextImage;

    // Reiniciar lupa al abrir modal
    if (lupa) {
        lupa.innerHTML = "";
        lupa.style.display = "none";
    }

    // Mostrar modal con Bootstrap 5
    const modalElement = document.getElementById('imageModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function updateModalImage() {
    const img = document.getElementById('imgModal');
    img.src = images[currentIndex];
    // limpiar lupa
    if (lupa) {
        lupa.innerHTML = "";
        lupa.style.display = "none";
    }
    checkButtons();
}

function prevImage() {
    if (currentIndex > 0) {
        currentIndex--;
        updateModalImage();
    }
}

function nextImage() {
    if (currentIndex < images.length - 1) {
        currentIndex++;
        updateModalImage();
    }
}

function checkButtons() {
    document.getElementById('prevBtn').style.display = currentIndex === 0 ? 'none' : 'inline';
    document.getElementById('nextBtn').style.display = currentIndex === images.length - 1 ? 'none' : 'inline';
}

/* ============================
   Formulario de contacto con EmailJS
============================ */
(function(){
  emailjs.init("wIL9V5R0sbXQVzgHF"); // tu Public Key
})();

document.getElementById("formContacto").addEventListener("submit", function(event) {
  event.preventDefault();

  // Actualiza los campos ocultos antes de enviar
  document.getElementById("carrito").value = JSON.stringify(carrito);
  document.getElementById("detallesPedido").value = JSON.stringify(detallesPedido);
  document.getElementById("totalPedido").value = total;

  emailjs.sendForm("service_2j45sst", "template_gj3tuwf", this)
    .then(() => {
      alert("Formulario enviado 🎉. ¡Gracias por tu pedido!");
      this.reset();
      carrito = [];
      total = 0;
      actualizarCarrito();
    }, (error) => {
      alert("Hubo un problema al enviar el formulario. Revisa la consola.");
      console.error("Error:", error);
    });
});


/* ============================
   Scroll suave a contacto
============================ */
function scrollToContacto() {
    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
}

/* ============================
   Modal del carrito
============================ */
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const checkoutBtn = document.getElementById('checkout-btn');

cartButton.addEventListener('click', () => {
  cartModal.style.display = 'block';
});

closeCart.addEventListener('click', () => {
  cartModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = 'none';
  }
});

checkoutBtn.addEventListener('click', () => {
  cartModal.style.display = 'none';
  scrollToContacto();
});

/* ============================
   Zoom en imagen del modal
============================ */
const imgModal = document.getElementById("imgModal");
const lupa = document.getElementById("lupa");
let zoomFactor = 3; // nivel de zoom

imgModal.addEventListener("mousemove", function(e) {
    const rect = imgModal.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lupa.style.display = "block";
    lupa.style.left = (x - lupa.offsetWidth / 2) + "px";
    lupa.style.top = (y - lupa.offsetHeight / 2) + "px";

    let zoomImg = lupa.querySelector("img");
    if (!zoomImg) {
        zoomImg = document.createElement("img");
        zoomImg.src = imgModal.src;
        zoomImg.style.position = "absolute";
        zoomImg.style.transformOrigin = "top left";
        zoomImg.style.transform = `scale(${zoomFactor})`;
        lupa.appendChild(zoomImg);
    }

    zoomImg.style.left = -(x * zoomFactor - lupa.offsetWidth / 2) + "px";
    zoomImg.style.top = -(y * zoomFactor - lupa.offsetHeight / 2) + "px";
});

imgModal.addEventListener("mouseleave", function() {
    lupa.style.display = "none";
    const zoomImg = lupa.querySelector("img");
    if (zoomImg) {
        lupa.removeChild(zoomImg);
    }
});
