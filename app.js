const products=[
{id:"ip17pm",name:"Apple iPhone 17 Pro Max 1TB iBox",price:500000,old:34249000,stock:2,img:"/img/iphone17promax.jpg",rating:"5 (3)"},
{id:"ipadpm5",name:"Apple iPad Pro M5 13-inch 512GB iBox",price:450000,old:35999000,stock:1,img:"/img/ipadprom5.jpg",rating:"0 (0)"},
{id:"ip16pm",name:"Apple iPhone 16 Pro Max 512GB iBox",price:650000,old:25999000,stock:1,img:"/img/iphone16promax.jpg",rating:"5 (2)"},
{id:"ip17",name:"Apple iPhone 17 512GB iBox",price:550000,old:22999000,stock:1,img:"/img/iphone17.jpg",rating:"5 (6)"}
];
const rupiah=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const grid=document.querySelector(".grid");
let selected=null;

function render(){
 grid.innerHTML=products.map(p=>`
 <article class="card">
  <div class="badges"><span class="stock">🔴 Sisa ${p.stock}</span><span class="discount">-98%</span></div>
  <img class="photo" src="${p.img}" alt="${p.name}">
  <div class="rating">★ ${p.rating}</div>
  <div class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
  <div class="name">${p.name}</div>
  <div class="price">${rupiah(p.price)}</div>
  <div class="old">${rupiah(p.old)}</div>
  <button class="primary buy" onclick="openCheckout('${p.id}')">Beli Sekarang</button>
 </article>`).join("");
}
render();

function openCheckout(id){
 selected=products.find(x=>x.id===id);
 document.getElementById("selected").innerHTML=`<div class="selected"><img src="${selected.img}"><div><b>${selected.name}</b><br>${rupiah(selected.price)}</div></div>`;
 document.getElementById("modal").classList.remove("hidden");
}
function closeCheckout(){document.getElementById("modal").classList.add("hidden")}

document.getElementById("checkoutForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const f=new FormData(e.target);
 const payload={productId:selected.id,name:f.get("name"),phone:f.get("phone"),address:f.get("address"),email:f.get("email")};
 try{
   const r=await fetch("/api/create-transaction",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
   const data=await r.json();
   if(!r.ok) throw new Error(data.error||"Gagal membuat pembayaran");
   closeCheckout();
   if(window.snap && data.token){
     window.snap.pay(data.token,{onSuccess:()=>alert("Pembayaran berhasil. Pesanan diproses."),onPending:()=>alert("Pesanan dibuat. Silakan selesaikan pembayaran."),onError:()=>alert("Pembayaran gagal."),onClose:()=>{}});
   }else{
     alert("Order berhasil dibuat. Mode pembayaran belum aktif karena Client/Server Key belum dipasang.");
   }
 }catch(err){alert(err.message)}
});

// Demo countdown
let seconds=8*86400+9*3600+41*60+4;
setInterval(()=>{if(seconds<0)return;let d=Math.floor(seconds/86400);let h=Math.floor(seconds%86400/3600);let m=Math.floor(seconds%3600/60);let s=seconds%60;document.getElementById("d").textContent=String(d).padStart(2,"0");document.getElementById("h").textContent=String(h).padStart(2,"0");document.getElementById("m").textContent=String(m).padStart(2,"0");document.getElementById("s").textContent=String(s).padStart(2,"0");seconds--},1000);
