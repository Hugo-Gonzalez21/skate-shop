// Definición del carrito
let carrito = [];
let productos = [];

// Función para actualizar el carrito
function actualizarCarrito() {
  const listaCarrito = document.getElementById("lista-carrito");
  const totalElemento = document.getElementById("total");
  const contadorCarrito = document.getElementById("carrito-contador");

  listaCarrito.innerHTML = "";
  let total = 0;
  let cantidadTotal = 0;

  if (carrito.length === 0) {
    listaCarrito.classList.add("lista-carrito-vacia");
    listaCarrito.innerHTML = `
      <li class="carrito-vacio">
        <i class="fas fa-shopping-cart"></i>
        <p>Tu carrito está vacío</p>
        <small>Agrega algunos productos increíbles</small>
      </li>
    `;
  } else {
    listaCarrito.classList.remove("lista-carrito-vacia");
    carrito.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>${item.nombre}</strong><br>
            <span style="color: #666;">$${item.precio.toLocaleString(
              "es-CL"
            )} x ${item.cantidad}</span>
          </div>
          <div style="text-align: right;">
            <div style="color: #fca311; font-weight: bold; font-size: 1.1rem;">
              $${(item.precio * item.cantidad).toLocaleString("es-CL")}
            </div>
            <button onclick="eliminarDelCarrito(${index})" style="background: #dc3545; color: white; border: none; padding: 5px 8px; border-radius: 5px; cursor: pointer; margin-top: 5px; font-size: 0.8rem;">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
      listaCarrito.appendChild(li);
      total += item.precio * item.cantidad;
      cantidadTotal += item.cantidad;
    });
  }

  totalElemento.textContent = `Total: $${total.toLocaleString("es-CL")}`;

  // Actualizar contador del carrito
  contadorCarrito.textContent = cantidadTotal;
  if (cantidadTotal > 0) {
    contadorCarrito.classList.add("visible");
  } else {
    contadorCarrito.classList.remove("visible");
  }
}

// Función para eliminar producto individual del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// Función para mostrar productos
function mostrarProductos(productosArray) {
  const contenedorProductos = document.getElementById("contenedor-productos");
  contenedorProductos.innerHTML = "";

  productosArray.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.setAttribute("data-id", producto.id);
    div.setAttribute("data-nombre", producto.nombre);
    div.setAttribute("data-precio", producto.precio);
    div.setAttribute("data-descripcion", producto.descripcion);
    div.setAttribute("data-categoria", producto.categoria);

    div.innerHTML = `
      <img src="${producto.imagen}" alt="${
      producto.nombre
    }" onerror="this.src='/placeholder.svg?height=250&width=300&text=${encodeURIComponent(
      producto.nombre
    )}'">
      <div class="producto-contenido">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="precio">$${producto.precio.toLocaleString("es-CL")}</p>
        <button class="btn-car">Agregar al carrito</button>
      </div>
    `;

    contenedorProductos.appendChild(div);
  });

  // Reconectar eventos después de mostrar productos
  const botonesAgregar = document.querySelectorAll(".btn-car");
  botonesAgregar.forEach((btn) => {
    btn.addEventListener("click", agregarAlCarrito);
  });
}

// Función para agregar producto al carrito
function agregarAlCarrito(e) {
  const producto = e.target.closest(".producto");
  const id = producto.getAttribute("data-id");
  const nombre = producto.getAttribute("data-nombre");
  const precio = Number.parseInt(producto.getAttribute("data-precio"));

  const productoExistente = carrito.find((item) => item.id === id);

  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }

  actualizarCarrito();
}

// Vaciar carrito
const vaciarBtn = document.getElementById("vaciar-carrito");
vaciarBtn.addEventListener("click", () => {
  carrito = [];
  actualizarCarrito();
});

// Panel carrito toggle
const abrirCarritoBtn = document.getElementById("abrir-carrito");
const carritoPanel = document.getElementById("carrito-panel");
const cerrarCarritoBtn = document.getElementById("cerrar-carrito");

abrirCarritoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  carritoPanel.classList.add("visible");
  carritoPanel.classList.remove("oculto");
});

cerrarCarritoBtn.addEventListener("click", () => {
  carritoPanel.classList.remove("visible");
  carritoPanel.classList.add("oculto");
});

// Menú móvil
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Filtros de categoría
  const filtrosBotones = document.querySelectorAll(".filtro-btn");

  filtrosBotones.forEach((boton) => {
    boton.addEventListener("click", () => {
      // Remover clase active de todos los botones
      filtrosBotones.forEach((btn) => btn.classList.remove("active"));
      // Agregar clase active al botón clickeado
      boton.classList.add("active");

      const categoria = boton.getAttribute("data-categoria");

      if (categoria === "todos") {
        mostrarProductos(productos);
      } else {
        const productosFiltrados = productos.filter(
          (producto) => producto.categoria === categoria
        );
        mostrarProductos(productosFiltrados);
      }
    });
  });

  // Botón proceder compra
  const procederCompraBtn = document.getElementById("proceder-compra");
  if (procederCompraBtn) {
    procederCompraBtn.addEventListener("click", () => {
      if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega algunos productos primero.");
        return;
      }
      alert("¡Gracias por tu compra! Serás redirigido al sistema de pago.");
      // Aquí puedes agregar la lógica de pago real
    });
  }

  // Cargar productos desde JSON
  fetch("productos.json")
    .then((res) => res.json())
    .then((data) => {
      productos = data;
      mostrarProductos(productos);
    })
    .catch((err) => console.error("Error al cargar productos:", err));
});
