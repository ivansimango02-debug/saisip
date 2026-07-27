const CACHE="saisip-v1";const ASSETS=["./","./index.html","./style.css","./app.js","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
self.addEventListener("push",e=>{let d={title:"SaiSip 💧",body:"Saiiiii 😭💧 DRINK."};try{d={...d,...e.data.json()}}catch{}e.waitUntil(self.registration.showNotification(d.title,{body:d.body,icon:"./icon.svg",badge:"./icon.svg"}))});