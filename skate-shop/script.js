const contenedorProductos = document.getElementById("contenedor-productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalElemento = document.getElementById("total");
const vaciarBtn = document.getElementById("vaciar-carrito");

let carrito = [];

// 1. Cargar productos desde JSON
fetch("productos.json")
  .then((res) => res.json())
  .then((productos) => {
    productos.forEach((producto) => {
      const div = document.createElement("div");
      div.classList.add("producto");
      div.setAttribute("data-id", producto.id);
      div.setAttribute("data-nombre", producto.nombre);
      div.setAttribute("data-precio", producto.precio);
      div.setAttribute("data-descripcion", producto.descripcion);

      div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="precio">$${producto.precio.toLocaleString("es-CL")}</p>
        <button class="btn-car">Agregar al carrito</button>
      `;

      contenedorProductos.appendChild(div);
    });

    // Después de que se agregan productos al DOM, conectar botones
    const botonesAgregar = document.querySelectorAll(".btn-car");
    botonesAgregar.forEach((btn) => {
      btn.addEventListener("click", agregarAlCarrito);
    });
  })
  .catch((err) => console.error("Error al cargar productos:", err));

// 2. Agregar producto al carrito
function agregarAlCarrito(e) {
  const producto = e.target.closest(".producto");
  const id = producto.getAttribute("data-id");
  const nombre = producto.getAttribute("data-nombre");
  const precio = parseInt(producto.getAttribute("data-precio"));

  const productoExistente = carrito.find((item) => item.id === id);

  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }

  actualizarCarrito();
}

// 3. Actualizar carrito en el panel lateral
function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio} x ${item.cantidad}`;
    listaCarrito.appendChild(li);
    total += item.precio * item.cantidad;
  });

  totalElemento.textContent = `Total: $${total.toLocaleString("es-CL")}`;
}

// 4. Vaciar carrito
vaciarBtn.addEventListener("click", () => {
  carrito = [];
  actualizarCarrito();
});

// 5. Panel carrito toggle
const abrirCarritoBtn = document.getElementById("abrir-carrito");
const carritoPanel = document.getElementById("carrito-panel");
const cerrarCarritoBtn = document.getElementById("cerrar-carrito");

abrirCarritoBtn.addEventListener("click", function (e) {
  e.preventDefault();
  carritoPanel.classList.add("visible");
  carritoPanel.classList.remove("oculto"); // <-- agrega esto
});
cerrarCarritoBtn.addEventListener("click", function () {
  carritoPanel.classList.remove("visible");
  carritoPanel.classList.add("oculto"); // <-- agrega esto
});
