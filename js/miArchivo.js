//referencio a los elementos del DOM con los que voy a trabajar

const card = document.querySelector("#cards");
const tabla = document.querySelector(".tbody");
const inputBuscar = document.querySelector("#buscar");
const filtro = document.querySelectorAll(".filtro");
const contador = document.querySelector("#contador");
const compraSimulada = document.querySelector(".simularCompra");
const vaciarCarrito = document.querySelector(".vaciarCarrito");
const btnActiv = document.querySelector('.botones-m');
let carrito = [];
let botonesClick = [];

// mi primera funcion es llamar a mi json, asi posteroriormente puedo pintar mis tarjetas.
function cargarJson(callback) {
  fetch("productosTienda.json")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      data.forEach((producto) => {
        card.innerHTML += `
        
          <div class="cart filtro oscuro" style="width: 15rem;">
                  <h4 class="card-title tit-bor filtrar text-center">${producto.nombre}</h4>
                  <img src="${producto.img}" class="tit-bor card-img-top">
              <div class="card-body text-center">
                  <h5 class="py-2">Precio: <span class="precio">$${producto.precio}</span></h5>
                  <div class="ident visually-hidden">${producto.id}</div>
                  <div class="gap-2">
                  <button class="btns botones botton">Añadir al Carrito</button>
              </div>
          </div>
         
          `;
        callback();
      });
    });
}

//llamo a la función dende cargo el json y creo otra y busco los botones con los que voy a trabajar.
cargarJson(() => {
  botonesClick = document.querySelectorAll(".botton");
  botonesClick.forEach((btns) => {
    btns.addEventListener("click", seleccionarProductos);
  });
  /* creo una función "buscador de productos" adentro de cargarJson, porque nose porqué si la dejo afuera no me la reconoce*/
  function buscador() {
    const filtro = document.querySelectorAll(".filtro");
    inputBuscar.addEventListener("keyup", (e) => {
      let texto = e.target.value;
      let expReg = new RegExp(texto, "i"); //con expresiones regulares hago que no distinga mayúsculas o minúsclas
      for (let i = 0; i < filtro.length; i++) {
        let valor = filtro[i];
        expReg.test(valor.innerText)
          ? valor.classList.remove("ocultar")
          : valor.classList.add("ocultar");

      }
    });
  }
  buscador();
});

//creo una función para que cada vez que hagan click se me agregue los item al carrito
function seleccionarProductos(e) {
  const button = e.target;
  // console.log(e.target);
  const item = button.closest(".cart"); //uso el atributo closest para obtener el contenedor con clase card donde obtengo todos los detalles del producto
  const itemTitulo = item.querySelector(".card-title").textContent;
  // console.log(itemTitulo);
  const itemPrecio = item.querySelector(".precio").textContent;
  // console.log(itemPrecio);
  const itemImg = item.querySelector(".card-img-top").src;
  // console.log(itemImg);
  const itemId = item.querySelector(".ident").textContent;
  // console.log(itemId);
  const productosSeleccionados = {
    //creo un objeto con lo obtenido anteriormente
    title: itemTitulo,
    precio: itemPrecio,
    img: itemImg,
    id: itemId,
    cantidad: 1,
  };
  // console.log(productosSeleccionados);
  agregarProductosAlCarrito(productosSeleccionados); //llamo a una función y le mando como parámetro el objeto creado
}

function activarBtn() {
  if (carrito.lenght === 0) {
    btnActiv = disabale = true
  }
}

//desde esta función tiro una alerta cada vez que se agrega un producto al carrito y hago que no se pinte más de una vez un producto ya seleccionado.
function agregarProductosAlCarrito(productosSeleccionados) {
  //desde SweetAlert tiro una alerta cuando se agrega un producto al carrito
  Swal.fire({
    position: "center",
    icon: "success",
    title: "producto agregado al carrito",
    showConfirmButton: false,
    timer: 1500,
  });

  //con un for recorro el carrito para que no se me pinten dos elementos del mismo producto
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].title === productosSeleccionados.title) {
      carrito[i].cantidad;
      return null
    }

  }

  //pusheo al carrito los productos que se van seleccionando.
  carrito.push(productosSeleccionados);
  // console.log(carrito,'carrito');
  agregarCarrito();
}

//agrego una funcion para ir pintando en el carrito los prodcutos que se van seleccionando
function agregarCarrito() {
  tabla.innerHTML = "";
  carrito.map((item) => {
    const tr = document.createElement("tr");
    tr.classList.add("ItemCarrito");
    const content = `
    
    <th scope="row" id="prodCant">ID${item.id}</th>
            <td class="table__productos">
              <img src=${item.img}  alt="">
              <h6 class="visually-hidden title">${item.title}</h6>
            </td>
            <td class="table__price"><p>${item.precio}</p></td>
            <td class="table__cantidad">
              <input type="number" min="1" value=${item.cantidad} class="input__elemento">
              <button class="delete btn btn-danger">x</button>
            </td>
    `;

    tr.innerHTML = content;
    tabla.append(tr);

    tr.querySelector(".delete").addEventListener("click", borrarItemCarrito);
    tr.querySelector(".input__elemento").addEventListener("change", sumaCantidad);

  });
  carritoTotal();
}

//creo una funcion para ir sumando el valor total de los productos.
function carritoTotal() {
  let Total = 0;
  const totalCompra = document.querySelector(".totalCompra");
  carrito.forEach((item) => {
    //recorro con un forEach los item del carrito y le saco el simbolo asi puedo sumar el precio
    const precio = Number(item.precio.replace("$", ""));
    Total = Total + precio * item.cantidad;
  });
  //mantengo desactivado el boton hasta que se agregue algun producto
  Total === 0 ? document.querySelector("#activar").disabled = true : document.querySelector("#activar").disabled = false
  //le agrego un texto cuando el carrito esta vacio
  Total === 0 ? totalCompra.innerHTML = `<i class='bx bxs-cart' style='color:#01f603'></i> VACIO` :
    totalCompra.innerHTML = `Total a pagar $${Total}`;
  contador.innerText = carrito.length;
  guardarDatos();
}
//creo una función para borrar los productos del carrito
function borrarItemCarrito(e) {
  const buttonDelete = e.target;
  const tr = buttonDelete.closest(".ItemCarrito");
  const title = tr.querySelector(".title").textContent;
  for (let i = 0; i < carrito.length; i++) {
    carrito[i].title === title ? carrito.splice(i, 1) : null;
  }
  //tiro una alerta por cada producto eliminado
  Swal.fire({
    position: "center",
    icon: "error",
    title: "Producto eliminado del carrito",
    showConfirmButton: false,
    timer: 1500,
  });

  tr.remove();
  carritoTotal();
}

//creo una afuncion para sumar desde el carrito la cantidad de productos
function sumaCantidad(e) {
  const sumaInput = e.target;
  const tr = sumaInput.closest(".ItemCarrito");
  const title = tr.querySelector(".title").textContent;
  //recorro el carrito para que cada vez que se repita un título se sume de a uno el value
  carrito.forEach((item) => {
    if (item.title === title) {
      sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
      item.cantidad = sumaInput.value;
      carritoTotal();
    } //llamo a la función carritoTotal para hacer la cuenta.
  });
}

//creo una funcion para limpiar todo el carrito
function limpiarCarrito() {
  vaciarCarrito.addEventListener('click', () => {
    carrito = [];
    agregarCarrito()
  })
}
limpiarCarrito()

function simularCompra() {
  compraSimulada.addEventListener("click", () => {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Desea finalizar la comrpa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Pagar',
      cancelButtonText: 'Seguir comprando',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        carrito = [];
        agregarCarrito()

        swalWithBootstrapButtons.fire(
          'muchas gracias por su compra',
          'Puedes seguir comprando',
          'success'
        )
      }
    })
  })
}
simularCompra()


//guardo los datos de mi carrito en el localStorage
function guardarDatos() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}



window.onload = function () {
  const storage = JSON.parse(localStorage.getItem("carrito"));
  storage ? (carrito = storage) : "";

  agregarCarrito();
};
