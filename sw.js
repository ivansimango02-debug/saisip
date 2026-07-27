const C="saisip-final-v3";
const A=["./","./index.html","./style.css","./app.js","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(A)))});
self.addEventListener("activate",e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k))))])));
self.addEventListener("fetch",e=>e.respondWith(fetch(e.request).then(r=>{let x=r.clone();caches.open(C).then(c=>c.put(e.request,x));return r}).catch(()=>caches.match(e.request))));
self.addEventListener("push",event=>{
 let d={title:"SaiSip 💧",body:"Saiiiii 😭💧 Drink some water. Ivan is watching 😂🩷",url:"./"};
 try{if(event.data)d={...d,...event.data.json()}}catch{}
 event.waitUntil(self.registration.showNotification(d.title,{
   body:d.body,icon:"./icon.svg",badge:"./icon.svg",tag:"saisip-water",renotify:true,data:{url:d.url||"./"}
 }));
});
self.addEventListener("notificationclick",event=>{
 event.notification.close();
 event.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
   for(const c of list){if("focus"in c)return c.focus()}
   return clients.openWindow(event.notification.data?.url||"./");
 }));
});