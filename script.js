const PRODUCTOS = [
  {id:'aura', nombre:'Accesorio Aura', precio:12990},
  {id:'lavanda', nombre:'Set Lavanda', precio:18990},
  {id:'lila', nombre:'Detalle Lila', precio:10990},
  {id:'violeta', nombre:'Charm Violeta', precio:14990}
];
let carrito = JSON.parse(localStorage.getItem('rti_carrito') || '[]');
const money = n => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
function producto(id){return PRODUCTOS.find(p=>p.id===id)}
function guardar(){localStorage.setItem('rti_carrito',JSON.stringify(carrito)); renderCarrito()}
function agregar(id){const p=producto(id); const item=carrito.find(x=>x.id===id); item?item.cantidad++:carrito.push({id,nombre:p.nombre,precio:p.precio,cantidad:1}); guardar(); abrirCarrito()}
function cambiar(id,delta){const i=carrito.findIndex(x=>x.id===id); if(i<0)return; carrito[i].cantidad+=delta; if(carrito[i].cantidad<=0)carrito.splice(i,1); guardar()}
function vaciar(){carrito=[];guardar()}
function renderCarrito(){
  const count=carrito.reduce((a,x)=>a+x.cantidad,0), total=carrito.reduce((a,x)=>a+x.precio*x.cantidad,0);
  document.querySelectorAll('.cart-count').forEach(e=>{e.textContent=count;e.classList.toggle('show',count>0)});
  const list=document.getElementById('cart-items');
  if(!list)return;
  list.innerHTML=carrito.length?carrito.map(x=>`<div class="cart-item"><div><b>${x.nombre}</b><small>${money(x.precio)} c/u</small></div><div class="qty"><button onclick="cambiar('${x.id}',-1)">−</button><span>${x.cantidad}</span><button onclick="cambiar('${x.id}',1)">+</button></div><strong>${money(x.precio*x.cantidad)}</strong></div>`).join(''):'<div class="empty">Tu carrito está vacío.<br><span>Agregá tus accesorios favoritos.</span></div>';
  document.getElementById('cart-total').textContent=money(total);
  document.getElementById('checkout-btn').disabled=!carrito.length;
}
function abrirCarrito(){document.getElementById('cart-drawer').classList.add('open');document.getElementById('cart-overlay').classList.add('open');document.body.classList.add('no-scroll')}
function cerrarCarrito(){document.getElementById('cart-drawer').classList.remove('open');document.getElementById('cart-overlay').classList.remove('open');document.body.classList.remove('no-scroll')}
function finalizar(){if(!carrito.length)return; document.getElementById('checkout-modal').classList.add('open');}
function cerrarCheckout(){document.getElementById('checkout-modal').classList.remove('open')}
function enviarPedido(e){e.preventDefault();const nombre=document.getElementById('cliente').value.trim();const contacto=document.getElementById('contacto-cliente').value.trim();const entrega=document.getElementById('entrega').value;const total=carrito.reduce((a,x)=>a+x.precio*x.cantidad,0);const detalle=carrito.map(x=>`• ${x.nombre} x${x.cantidad} — ${money(x.precio*x.cantidad)}`).join('%0A');const texto=`Hola RTI Creaciones!%0A%0AQuiero realizar este pedido:%0A${detalle}%0A%0ATotal: ${money(total)}%0ANombre: ${encodeURIComponent(nombre)}%0AContacto: ${encodeURIComponent(contacto)}%0AEntrega: ${encodeURIComponent(entrega)}`;window.location.href=`mailto:contacto@rticreaciones.com?subject=Pedido RTI Creaciones&body=${texto}`}
function consultar(nombre){const p=PRODUCTOS.find(x=>x.nombre===nombre); if(p) agregar(p.id); else alert('Producto agregado al carrito.')}
document.addEventListener('DOMContentLoaded',()=>{renderCarrito();document.querySelectorAll('.add-cart').forEach(b=>b.addEventListener('click',()=>agregar(b.dataset.id)));});
