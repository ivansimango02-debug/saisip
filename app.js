const KEY="saisip_v2";
const oldKeys=["saisip_v1"];
const messages=[
"Your body needs water, not more overthinking 😂💧",
"Breaking news 🚨 Sai has forgotten her water again.",
"Hey princess 👑 Enough scrolling. Drink water 😂",
"Sai… that glass isn't going to drink itself 👀💧",
"Your water is feeling ignored 🥲💧",
"250 ml. That's all I'm asking. Don't make this difficult 😂",
"Ivan loves you 🩷 Your hydration level… questionable 👀",
"Another reminder? Yes. Apparently the first one was decoration 😂",
"Saiiiii 😭💧 DRINK.",
"Hydrated Sai = happy Sai 🌸 Science probably."
];
const keyFor=d=>{let x=d||new Date();return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`};
const today=()=>keyFor();
const fresh=()=>({startedAt:new Date().toISOString(),goal:2000,interval:60,start:"08:00",end:"22:00",reminders:false,days:{[today()]:{ml:0,entries:[]}},bestStreak:0});
let data=null;
try{data=JSON.parse(localStorage.getItem(KEY))}catch{}
if(!data){for(const k of oldKeys){try{let x=JSON.parse(localStorage.getItem(k));if(x){data=x;break}}catch{}}}
if(!data)data=fresh();
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function ensure(){if(!data.days)data.days={};if(!data.days[today()])data.days[today()]={ml:0,entries:[]};save()}
function toast(t){const e=document.querySelector("#toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1700)}
function addWater(ml){ensure();let d=data.days[today()];d.ml+=ml;d.entries=d.entries||[];d.entries.push({ml,time:new Date().toISOString()});save();render();toast(`+${ml} ml 💧`)}
function currentStreak(){let s=0,d=new Date();for(let i=0;i<1000;i++){let k=keyFor(d),rec=data.days[k];if(k===today()&&(!rec||rec.ml<data.goal)){d.setDate(d.getDate()-1);continue}if(rec&&rec.ml>=data.goal)s++;else break;d.setDate(d.getDate()-1)}return s}
function getNextReminder(){if(!data.reminders)return ["Not scheduled","Enable in Settings"];let now=new Date(),[sh,sm]=data.start.split(":").map(Number),[eh,em]=data.end.split(":").map(Number);let st=new Date(),en=new Date();st.setHours(sh,sm,0,0);en.setHours(eh,em,0,0);let n=now<st?st:new Date(now.getTime()+data.interval*60000);if(n>en)return ["Tomorrow "+data.start,"Sleep well 🌙"];return [n.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),`in about ${data.interval} min`]}
function render(){
 ensure();let rec=data.days[today()],pct=Math.min(100,Math.round(rec.ml/data.goal*100)),deg=pct*3.6;
 todayMl.textContent=rec.ml.toLocaleString();goalMl.textContent=data.goal.toLocaleString();percent.textContent=pct+"%";ring.style.background=`conic-gradient(#ff3f8d ${deg}deg,#fbe1eb ${deg}deg)`;
 let h=new Date().getHours();greeting.textContent=`Good ${h<12?"morning":h<18?"afternoon":"evening"}, Sai 💗`;
 encourage.textContent=pct>=100?"You did it, Sai! Ivan is proud 🩷🎉":pct>=75?"Sai, we're literally almost there 😭💗":pct>=50?"You're doing great, Sai! Keep going 💪💖":pct>=25?"Okayyy, progress! Don't abandon the bottle now 😂":"Let's get hydrated, Sai! 💧🩷";
 funnyMessage.textContent=messages[Math.floor(Date.now()/86400000)%messages.length];
 let s=currentStreak();data.bestStreak=Math.max(data.bestStreak||0,s);save();streak.textContent=s+" day"+(s===1?"":"s");bestStreak.textContent=data.bestStreak+" day"+(data.bestStreak===1?"":"s");
 let nr=getNextReminder();nextReminder.textContent=nr[0];reminderSub.textContent=nr[1];
 let st=new Date(data.startedAt),dayN=Math.floor((new Date()-st)/86400000)+1;startedOn.textContent=`Started ${st.toLocaleDateString("en",{day:"numeric",month:"short",year:"numeric"})} • Day ${dayN}`;settingsStarted.textContent=`Sai started on ${st.toLocaleDateString("en",{day:"numeric",month:"long",year:"numeric"})} 🩷`;
 renderHistory();fillSettings()
}
function renderHistory(){
 let last=[];for(let i=6;i>=0;i--){let d=new Date();d.setDate(d.getDate()-i);let k=keyFor(d);last.push([k,data.days[k]?.ml||0,d])}
 let avg=Math.round(last.reduce((a,x)=>a+x[1],0)/7);weekAverage.textContent=avg.toLocaleString()+" ml";chartGoal.textContent=data.goal.toLocaleString()+" ml";
 chart.innerHTML=last.map(([k,v,d])=>`<div class="bar-col"><div class="bar-value">${v?v.toLocaleString():""}</div><div class="bar" style="height:${Math.max(2,Math.min(90,v/data.goal*90))}%"></div><div class="bar-label">${d.toLocaleDateString("en",{weekday:"short"})}</div></div>`).join("");
 let keys=Object.keys(data.days).sort(),vals=keys.map(k=>data.days[k].ml||0),hits=vals.filter(v=>v>=data.goal).length,best=Math.max(0,...vals),total=vals.reduce((a,b)=>a+b,0);
 goalsHit.textContent=hits+" day"+(hits===1?"":"s");bestDay.textContent=best.toLocaleString()+" ml";daysTracked.textContent=keys.length;totalAll.textContent=(total/1000).toFixed(1)+" L";
 daySummary.innerHTML=last.slice().reverse().map(([k,v,d])=>`<div class="summary-row"><span>${d.toLocaleDateString("en",{weekday:"short",day:"numeric",month:"short"})}</span><div class="summary-track"><div class="summary-fill" style="width:${Math.min(100,v/data.goal*100)}%"></div></div><b>${v.toLocaleString()} ml</b></div>`).join("")
}
function fillSettings(){goalInput.value=data.goal;intervalInput.value=String(data.interval);startInput.value=data.start;endInput.value=data.end;remindersInput.checked=!!data.reminders}
document.querySelectorAll("[data-ml]").forEach(b=>b.onclick=()=>addWater(+b.dataset.ml));
customBtn.onclick=()=>{let n=Number(prompt("How many ml did Sai drink?","300"));if(n>0&&n<5000)addWater(Math.round(n))};
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav,.page").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelector("#"+b.dataset.page).classList.add("active");render()});
saveSettings.onclick=async()=>{data.goal=Math.max(250,Number(goalInput.value)||2000);data.interval=Number(intervalInput.value)||60;data.start=startInput.value||"08:00";data.end=endInput.value||"22:00";data.reminders=remindersInput.checked;if(data.reminders&&"Notification"in window&&Notification.permission!=="granted"){let p=await Notification.requestPermission();if(p!=="granted")data.reminders=false}save();render();toast("Settings saved 🩷")};
resetBtn.onclick=()=>{if(confirm("Reset all SaiSip history and settings?")){data=fresh();save();render();toast("SaiSip reset")}};
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js");
render();

// ---------- SaiSip Web Push ----------
const PUSH_API = "https://saisip-push.ivansimango02.workers.dev";
const VAPID_PUBLIC_KEY = "BLNtPE0kfrRsYktofuo1M19IdnJG3kuAZPWAP2RDDbI85-BIb1RqCi1gcybGwINykamVCMlc-CM7KyRTwV0UDA0";

function urlBase64ToUint8Array(base64String){
  const padding="=".repeat((4-base64String.length%4)%4);
  const base64=(base64String+padding).replace(/-/g,"+").replace(/_/g,"/");
  const rawData=atob(base64);
  return Uint8Array.from([...rawData].map(c=>c.charCodeAt(0)));
}
async function enablePush(){
  const status=document.querySelector("#pushStatus");
  if(!("serviceWorker" in navigator)||!("PushManager" in window)||!("Notification" in window)){
    status.textContent="This browser does not support Web Push.";
    return;
  }
  if(PUSH_API.startsWith("PASTE_")||VAPID_PUBLIC_KEY.startsWith("PASTE_")){
    status.textContent="Push backend needs its final 2 configuration values first.";
    toast("Push setup not connected yet");
    return;
  }
  try{
    const permission=await Notification.requestPermission();
    if(permission!=="granted"){status.textContent="Notification permission was not granted.";return}
    const reg=await navigator.serviceWorker.ready;
    let sub=await reg.pushManager.getSubscription();
    if(!sub){
      sub=await reg.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }
    const response=await fetch(PUSH_API+"/subscribe",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        subscription:sub,
        settings:{interval:data.interval,start:data.start,end:data.end,enabled:true,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone},
        name:"Sai"
      })
    });
    if(!response.ok) throw new Error("Subscription server error");
    data.reminders=true; save(); remindersInput.checked=true;
    status.textContent="Notifications enabled on this iPhone 🩷";
    toast("iPhone notifications enabled 🔔");
  }catch(err){
    console.error(err);
    status.textContent="Could not enable push. Check the backend configuration.";
  }
}
document.querySelector("#enablePushBtn")?.addEventListener("click",enablePush);

async function syncPushSettings(){
  if(PUSH_API.startsWith("PASTE_")||!("serviceWorker" in navigator)) return;
  try{
    const reg=await navigator.serviceWorker.ready;
    const sub=await reg.pushManager.getSubscription();
    if(!sub)return;
    await fetch(PUSH_API+"/subscribe",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        subscription:sub,
        settings:{interval:data.interval,start:data.start,end:data.end,enabled:data.reminders,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone},
        name:"Sai"
      })
    });
  }catch(e){console.error(e)}
}
document.querySelector("#saveSettings")?.addEventListener("click",()=>setTimeout(syncPushSettings,100));
