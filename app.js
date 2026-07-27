const KEY="saisip_v1";
const messages=[
"Good morning, Sai 🩷 Ivan loves you. Your water bottle also misses you 😂",
"Breaking news 🚨 Sai has forgotten her water again.",
"Hey princess 👑 Enough scrolling. Drink water 😂",
"Sai… that glass isn’t going to drink itself 👀💧",
"Your water is feeling ignored 🥲💧",
"250 ml. That’s all I’m asking. Don’t make this difficult 😂",
"Ivan loves you 🩷 Your hydration level… questionable 👀",
"Another reminder? Yes. Apparently the first one was decoration 😂",
"Saiiiii 😭💧 DRINK.",
"Hydrated Sai = happy Sai 🌸 Science probably."
];
const today=()=>new Date().toLocaleDateString("en-CA");
const defaults=()=>({startedAt:new Date().toISOString(),goal:2000,interval:60,start:"08:00",end:"22:00",reminders:false,days:{[today()]:{ml:0,entries:[]}},bestStreak:0});
let data;
try{data=JSON.parse(localStorage.getItem(KEY))||defaults()}catch{data=defaults()}
function ensure(){if(!data.days[today()])data.days[today()]={ml:0,entries:[]};save()}
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function toast(t){const x=document.querySelector("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800)}
function addWater(ml){ensure();const d=data.days[today()];d.ml+=ml;d.entries.push({ml,time:new Date().toISOString()});save();render();toast(`+${ml} ml 💧`);if(d.ml>=data.goal)toast("Goal complete! Ivan is proud of you 🩷")}
function dateLabel(k){return new Date(k+"T12:00:00").toLocaleDateString("en",{weekday:"short",month:"short",day:"numeric"})}
function streak(){
 let s=0,d=new Date(); for(let i=0;i<500;i++){const k=d.toLocaleDateString("en-CA");const day=data.days[k];if(day&&day.ml>=data.goal)s++;else if(k!==today())break;else if(day&&day.ml<data.goal){d.setDate(d.getDate()-1);continue}else break;d.setDate(d.getDate()-1)}
 return s
}
function nextReminder(){
 if(!data.reminders)return "Reminders are off";
 const now=new Date(),[sh,sm]=data.start.split(":").map(Number),[eh,em]=data.end.split(":").map(Number);
 let start=new Date();start.setHours(sh,sm,0,0);let end=new Date();end.setHours(eh,em,0,0);
 let n=new Date(now.getTime()+data.interval*60000);if(now<start)n=start;if(n>end)return "Tomorrow at "+data.start;
 return n.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
}
function render(){
 ensure();const d=data.days[today()],pct=Math.min(100,Math.round(d.ml/data.goal*100));
 document.querySelector("#todayMl").textContent=d.ml.toLocaleString();document.querySelector("#goalMl").textContent=data.goal.toLocaleString();document.querySelector("#percent").textContent=pct+"%";
 document.querySelector("#remaining").textContent=d.ml>=data.goal?"Goal complete! 🎉":`${(data.goal-d.ml).toLocaleString()} ml to go`;
 const hour=new Date().getHours();document.querySelector("#greeting").textContent=`Good ${hour<12?"morning":hour<18?"afternoon":"evening"}, Sai 🩷`;
 document.querySelector("#todayLabel").textContent=new Date().toLocaleDateString("en",{weekday:"long",month:"long",day:"numeric"});
 let s=streak();data.bestStreak=Math.max(data.bestStreak||0,s);save();document.querySelector("#streak").textContent=s+" day"+(s===1?"":"s");document.querySelector("#bestStreak").textContent=data.bestStreak+" day"+(data.bestStreak===1?"":"s");
 document.querySelector("#nextReminder").textContent=nextReminder();
 const seed=Math.floor(Date.now()/86400000)%messages.length;document.querySelector("#funnyMessage").textContent=messages[seed];
 const start=new Date(data.startedAt);const days=Math.floor((Date.now()-start)/86400000)+1;document.querySelector("#startedOn").textContent=`Started ${start.toLocaleDateString("en",{month:"long",day:"numeric",year:"numeric"})} • Day ${days} with SaiSip 🩷`;
 renderHistory();fillSettings();
}
function renderHistory(){
 const keys=Object.keys(data.days).sort();const vals=keys.map(k=>data.days[k].ml);const total=vals.reduce((a,b)=>a+b,0);const last=[];
 for(let i=6;i>=0;i--){let d=new Date();d.setDate(d.getDate()-i);let k=d.toLocaleDateString("en-CA");last.push([k,data.days[k]?.ml||0])}
 document.querySelector("#weekAverage").textContent=Math.round(last.reduce((a,x)=>a+x[1],0)/7)+" ml avg";
 document.querySelector("#chart").innerHTML=last.map(([k,v])=>`<div class="bar-col"><div class="bar" style="height:${Math.max(3,Math.min(100,v/data.goal*100))}%"></div><small>${new Date(k+"T12:00").toLocaleDateString("en",{weekday:"narrow"})}</small></div>`).join("");
 document.querySelector("#totalAll").textContent=(total/1000).toFixed(1)+" L";document.querySelector("#goalsHit").textContent=vals.filter(v=>v>=data.goal).length;document.querySelector("#daysTracked").textContent=keys.length;document.querySelector("#bestDay").textContent=(Math.max(0,...vals)).toLocaleString()+" ml";
 document.querySelector("#log").innerHTML=keys.slice().reverse().slice(0,10).map(k=>`<div class="log-row"><span>${dateLabel(k)}</span><strong>${data.days[k].ml.toLocaleString()} ml</strong></div>`).join("")||"<p class='muted'>No entries yet.</p>";
}
function fillSettings(){goalInput.value=data.goal;intervalInput.value=String(data.interval);startInput.value=data.start;endInput.value=data.end;remindersInput.checked=data.reminders}
document.querySelectorAll(".add[data-ml]").forEach(b=>b.onclick=()=>addWater(+b.dataset.ml));
customBtn.onclick=()=>{let x=prompt("How many ml did Sai drink?","300");x=Number(x);if(x>0&&x<5000)addWater(Math.round(x))};
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav,.page").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelector("#"+b.dataset.page).classList.add("active");render()});
saveSettings.onclick=async()=>{data.goal=Math.max(250,+goalInput.value||2000);data.interval=+intervalInput.value;data.start=startInput.value||"08:00";data.end=endInput.value||"22:00";data.reminders=remindersInput.checked;save();if(data.reminders)await requestNotifications();render();toast("Settings saved 🩷")};
async function requestNotifications(){if(!("Notification"in window)){toast("Notifications not supported here");return}if(Notification.permission!=="granted"){const p=await Notification.requestPermission();if(p!=="granted"){data.reminders=false;save();toast("Notification permission needed")}}}
notifyBtn.onclick=requestNotifications;
resetBtn.onclick=()=>{if(confirm("Reset all water history and settings?")){data=defaults();save();render();toast("SaiSip reset")}};
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js");
render();