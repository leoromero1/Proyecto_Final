const btnSwicht = document.querySelector("#switchPricipal");
const btnSwichts = document.querySelector("#switchPricipals");
const animacion = document.querySelector(".menu_arrow");
const menuResponsive = document.querySelector("#menu-responsive");
const carritoRes = document.querySelector(".cartnum");


function modoOscuro() {
  btnSwicht.addEventListener("click", () => {
    document.body.classList.toggle("oscuro");
    btnSwicht.classList.toggle("active");
  })
  btnSwichts.addEventListener("click", () => {
    document.body.classList.toggle("oscuro");
    btnSwichts.classList.toggle("actives");
  })
};

function animarArrow(){
  animacion.addEventListener("click", ()=>{
    animacion.classList.toggle("activeArrow")
    
  })
};

function abrirMenu(){
  menuResponsive.addEventListener("click", (e) =>{
    const res = document.querySelector("body");
    res.classList.toggle('con-menu')

  })
};

function resCarrito() {
  carritoRes.addEventListener("click",(e)=>{
    const act = document.querySelector("body");
    act.classList.toggle('act-carrito')
  })
};

modoOscuro();
animarArrow();
abrirMenu();
resCarrito();