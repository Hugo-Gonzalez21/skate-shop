// Base de datos de productos
const productos = [
  {
    id: 1,
    nombre: "Tabla Complete Pro",
    categoria: "tablas",
    precio: 89.99,
    precioAnterior: 109.99,
    imagen: "/placeholder.svg?height=250&width=300",
    descripcion: "Tabla completa profesional para skaters avanzados",
    badge: "oferta",
  },
  {
    id: 2,
    nombre: "Ruedas Street 52mm",
    categoria: "ruedas",
    precio: 24.99,
    imagen: "/placeholder.svg?height=250&width=300",
    descripcion: "Ruedas perfectas para street skating",
    badge: "nuevo",
  },
  {
    id: 3,
    nombre: "Trucks Independent",
    categoria: "trucks",
    precio: 45.99,
    imagen: "/placeholder.svg?height=250&width=300",
    descripcion: "Trucks de alta calidad Independent",
    badge: null,
  },
  {
    id: 4,
    nombre: "Tabla Deck 8.0",
    categoria: "tablas",
    precio: 39.99,
    imagen: "/placeholder.svg?height=250&width=300",
    descripcion: "Deck de 8 pulgadas, perfecto para principiantes",
    badge: null,
  },
  {
    id: 5,
    nombre: "Rodamientos ABEC 7",
    categoria: "accesorios",
    precio: 19.99,
    precioAnterior: 29.99,
    imagen: "/placeholder.svg?height=250&width=300",
    descripción: "Rodamientos de precisión ABEC 7",
    badge: "oferta",
  },
  {
    id: 6,
    nombre: "Ruedas Cruiser 60mm",
    categoria: "ruedas",
    precio: 32.99,
    imagen: "/placeholder.svg?height=250&width=300",
    descripcion: "Ruedas suaves para cruising",
    badge: "nuevo",
  },
  {
    id: 7,
    nombre: 'Tabla Longboard 42"',
    categoria: "tablas",
    precio: 129.99,
    imagen: "/placeholder.svg?height=250&width=300",
    descripcion: "Longboard completo de 42 pulgadas",
    badge: null,
  },
  {
    id: 8,
    nombre: "Grip Tape Negro",
    categoria: "accesorios",
    precio: 8.99,
    imagen: "/placeholder.svg?height=250&width=300",
    descripcion: "Grip tape adhesivo de alta calidad",
    badge: null,
  },
  {
    id: 9,
    nombre: "Trucks Thunder",
    categoria: "trucks",
    precio: 52.99,
    imagen: "/placeholder.svg?height=250&width=300",
    descripcion: "Trucks Thunder para performance superior",
    badge: "nuevo",
  },
];

// Variables globales
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let categoriaActual = "todos";

// Elementos del DOM
const contenedorProductos = document.getElementById("contenedor-productos");
const carritoPanel = document.getElementById("carrito-panel");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");
const contadorCarrito = document.getElementById("contador-carrito");
const carritoVacio = document.getElementById("carrito-vacio");
const carritoTotal = document.getElementById("carrito-total");

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  renderizarProductos();
  actualizarCarrito();
  inicializarEventListeners();
});

function inicializarEventListeners() {
  // Menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Carrito
  document.getElementById("abrir-carrito").addEventListener("click", (e) => {
    e.preventDefault();
    carritoPanel.classList.add("visible");
  });

  document.getElementById("cerrar-carrito").addEventListener("click", () => {
    carritoPanel.classList.remove("visible");
  });

  document
    .getElementById("vaciar-carrito")
    .addEventListener("click", vaciarCarrito);
  document
    .getElementById("finalizar-compra")
    .addEventListener("click", finalizarCompra);

  // Filtros
  const filtros = document.querySelectorAll(".filtro-btn");
  filtros.forEach((filtro) => {
    filtro.addEventListener("click", (e) => {
      // Remover clase active de todos los filtros
      filtros.forEach((f) => f.classList.remove("active"));
      // Agregar clase active al filtro clickeado
      e.target.classList.add("active");

      categoriaActual = e.target.dataset.categoria;
      renderizarProductos();
    });
  });

  // Cerrar carrito al hacer click fuera
  document.addEventListener("click", (e) => {
    if (
      !carritoPanel.contains(e.target) &&
      !e.target.closest("#abrir-carrito")
    ) {
      carritoPanel.classList.remove("visible");
    }
  });
}

function renderizarProductos() {
  const productosFiltrados =
    categoriaActual === "todos"
      ? productos
      : productos.filter((producto) => producto.categoria === categoriaActual);

  contenedorProductos.innerHTML = "";

  productosFiltrados.forEach((producto) => {
    const productoHTML = `
            <div class="producto-card" data-categoria="${producto.categoria}">
                <div class="producto-imagen">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    ${
                      producto.badge
                        ? `<div class="producto-badge ${producto.badge}">${
                            producto.badge === "oferta" ? "Oferta" : "Nuevo"
                          }</div>`
                        : ""
                    }
                </div>
                <div class="producto-info">
                    <div class="producto-categoria">${producto.categoria}</div>
                    <h3>${producto.nombre}</h3>
                    <div class="producto-precio">
                        ${
                          producto.precioAnterior
                            ? `<span class="precio-anterior">$${producto.precioAnterior}</span>`
                            : ""
                        }
                        <span class="precio-actual">$${producto.precio}</span>
                    </div>
                    <button class="btn-agregar" onclick="agregarAlCarrito(${
                      producto.id
                    })">
                        <i class="fas fa-shopping-cart"></i>
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
    contenedorProductos.innerHTML += productoHTML;
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  const productoEnCarrito = carrito.find((item) => item.id === id);

  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push({
      ...producto,
      cantidad: 1,
    });
  }

  // Feedback visual
  const btn = event.target.closest(".btn-agregar");
  btn.classList.add("agregado");
  btn.innerHTML = '<i class="fas fa-check"></i> Agregado';

  setTimeout(() => {
    btn.classList.remove("agregado");
    btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Agregar al Carrito';
  }, 1500);

  actualizarCarrito();
  guardarCarrito();
}

function actualizarCarrito() {
  // Actualizar contador
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  contadorCarrito.textContent = totalItems;

  // Mostrar/ocultar elementos según si el carrito está vacío
  if (carrito.length === 0) {
    carritoVacio.style.display = "block";
    carritoTotal.style.display = "none";
    listaCarrito.innerHTML = "";
  } else {
    carritoVacio.style.display = "none";
    carritoTotal.style.display = "block";
    renderizarCarrito();
  }

  // Calcular total
  const total = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );
  totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
}

function renderizarCarrito() {
  listaCarrito.innerHTML = "";

  carrito.forEach((item) => {
    const itemHTML = `
            <li class="item-carrito">
                <img src="${item.imagen}" alt="${item.nombre}" class="item-imagen">
                <div class="item-info">
                    <div class="item-nombre">${item.nombre}</div>
                    <div class="item-precio">$${item.precio}</div>
                    <div class="item-cantidad">
                        <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                        <span class="cantidad">${item.cantidad}</span>
                        <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                        <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </li>
        `;
    listaCarrito.innerHTML += itemHTML;
  });
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find((item) => item.id === id);
  if (item) {
    item.cantidad += cambio;
    if (item.cantidad <= 0) {
      eliminarDelCarrito(id);
    } else {
      actualizarCarrito();
      guardarCarrito();
    }
  }
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter((item) => item.id !== id);
  actualizarCarrito();
  guardarCarrito();
}

function vaciarCarrito() {
  if (carrito.length > 0) {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      carrito = [];
      actualizarCarrito();
      guardarCarrito();
    }
  }
}

function finalizarCompra() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  const total = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );
  const mensaje = `¡Gracias por tu compra!\n\nResumen:\n${carrito
    .map(
      (item) =>
        `${item.nombre} x${item.cantidad} - $${(
          item.precio * item.cantidad
        ).toFixed(2)}`
    )
    .join("\n")}\n\nTotal: $${total.toFixed(2)}`;

  alert(mensaje);

  // Vaciar carrito después de la compra
  carrito = [];
  actualizarCarrito();
  guardarCarrito();
  carritoPanel.classList.remove("visible");
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Smooth scrolling para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
