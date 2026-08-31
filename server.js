require("dotenv").config();
const express=require("express");
const crypto=require("crypto");
const midtransClient=require("midtrans-client");
const app=express();
app.use(express.json());
app.use(express.static("public"));

const products={
 ip17pm:{name:"Apple iPhone 17 Pro Max 1TB iBox",price:500000},
 ipadpm5:{name:"Apple iPad Pro M5 13-inch 512GB iBox",price:450000},
 ip16pm:{name:"Apple iPhone 16 Pro Max 512GB iBox",price:650000},
 ip17:{name:"Apple iPhone 17 512GB iBox",price:550000}
};

const snap=new midtransClient.Snap({
 isProduction:process.env.MIDTRANS_IS_PRODUCTION==="true",
 serverKey:process.env.MIDTRANS_SERVER_KEY
});

app.post("/api/create-transaction",async(req,res)=>{
 try{
  const {productId,name,phone,address,email}=req.body;
  const p=products[productId];
  if(!p) return res.status(400).json({error:"Produk tidak ditemukan"});
  if(!name||!phone||!address) return res.status(400).json({error:"Data pembeli belum lengkap"});
  const orderId="JPH-"+Date.now()+"-"+crypto.randomBytes(3).toString("hex").toUpperCase();
  const parameter={
   transaction_details:{order_id:orderId,gross_amount:p.price},
   item_details:[{id:productId,price:p.price,quantity:1,name:p.name}],
   customer_details:{first_name:name,phone,email:email||undefined},
   custom_field1:address
  };
  const transaction=await snap.createTransaction(parameter);
  // Simpan order ke database pada implementasi produksi.
  res.json({orderId,token:transaction.token,redirect_url:transaction.redirect_url});
 }catch(e){
  console.error(e);
  res.status(500).json({error:"Gagal membuat transaksi. Cek konfigurasi Midtrans."});
 }
});

// Endpoint notifikasi Midtrans.
// Produksi: validasi signature_key, lalu simpan status order ke database.
app.post("/api/midtrans/notification",express.json(),(req,res)=>{
 console.log("Midtrans notification:",req.body);
 res.sendStatus(200);
});

const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`JastiPhone berjalan di http://localhost:${port}`));
