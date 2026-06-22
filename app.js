let history = JSON.parse(localStorage.getItem("history")) || [];
let participants = JSON.parse(localStorage.getItem("participants")) || [];
let availableRiders = [...riders];
let isAdmin = false;

const pointsTable = [25,20,16,14,12,10,8,6,4,2];

// 💾 OPSLAAN
function save(){
  localStorage.setItem("participants", JSON.stringify(participants));
  localStorage.setItem("history", JSON.stringify(history));
}

// 🔐 LOGIN
function login(){
  const pw = prompt("Admin wachtwoord:");

  if(pw === "travoo123"){
    isAdmin = true;
    alert("Welkom admin 🚴");
    render();
  } else {
    alert("Fout wachtwoord");
  }
}

// ➕ DEELNEMER
function addParticipant(){
  let name = document.getElementById("name").value;
  if(!name) return;

  participants.push({
    name,
    rider: "",
    points: 0
  });

  document.getElementById("name").value = "";
  save();
  render();
}

// 🗑️ VERWIJDER
function deleteParticipant(index){
  let p = participants[index];

  if(p.rider){
    availableRiders.push(p.rider);
  }

  participants.splice(index,1);
  save();
  render();
}

// 🚴 RENNER TOEWIJZEN
function assignRider(){
  let pIndex = document.getElementById("participantSelect").value;
  let rider = document.getElementById("riderSelect").value;

  if(!participants[pIndex]) return;

  participants[pIndex].rider = rider;

  availableRiders = availableRiders.filter(r => r !== rider);

  save();
  render();
}

// 📊 PUNTEN BEREKENEN
function calculatePoints(){

  for(let i=0;i<10;i++){
    let rider = document.getElementById("m"+i).value;

    participants.forEach(p=>{
      if(p.rider === rider){
        p.points += pointsTable[i];
      }
    });
  }
history.push({
  stage: history.length + 1,
  data: document.getElementById("stageModal") ? "rit ingevoerd" : "rit"
});

localStorage.setItem("history", JSON.stringify(history));
  save();
  render();
  closeStageModal();
}

// 🚴 INPUTS RIT
function loadStageInputs(){
  let html = "";
  for(let i=0;i<10;i++){
    html += `<input placeholder="${i+1}. renner" id="r${i}"><br>`;
  }
  document.getElementById("stageInputs").innerHTML = html;
}

// 🔄 RENDER (BELANGRIJK)
function render(){

  // deelnemerslijst
  let html = "";

  participants.forEach((p,i)=>{
    html += `
    <div class="card">
      <b>${p.name}</b><br>
      🚴 ${p.rider || "geen renner"}<br>
      ⭐ ${p.points} pt<br>
      ${isAdmin ? `<button class="delete" onclick="deleteParticipant(${i})">🗑️ Verwijder</button>` : ""}
    </div>`;
  });

  document.getElementById("participants").innerHTML = html;

  // dropdown deelnemers
  let p = document.getElementById("participantSelect");
  if(p){
    p.innerHTML = "";
    participants.forEach((x,i)=>{
      if(!x.rider){
        let opt = document.createElement("option");
        opt.value = i;
        opt.textContent = x.name;
        p.appendChild(opt);
      }
    });
    updatePodium();
  }

  // dropdown renners
  let r = document.getElementById("riderSelect");
  if(r){
    r.innerHTML = "";
    availableRiders.forEach(rider=>{
      let opt = document.createElement("option");
      opt.value = rider;
      opt.textContent = rider;
      r.appendChild(opt);
    });
  }

  // klassement
  let sorted = [...participants].sort((a,b)=>b.points-a.points);

  let rank = "";
  sorted.forEach((p,i)=>{
    rank += `
      <div class="card">
        #${i+1} ${p.name} - ${p.points} pt
      </div>
    `;
  });

  document.getElementById("ranking").innerHTML = rank;
  let h = "";

history.forEach(r=>{
  h += `Rit ${r.stage}<br>`;
});

document.getElementById("history").innerHTML = h;
}

// 🚀 INIT
loadStageInputs();
render();
function updatePodium(){

  let sorted = [...participants].sort((a,b)=>b.points-a.points);

  let html = "";

  if(sorted[0]){
    html += `🥇 ${sorted[0].name} (${sorted[0].points})<br>`;
  }
  if(sorted[1]){
    html += `🥈 ${sorted[1].name} (${sorted[1].points})<br>`;
  }
  if(sorted[2]){
    html += `🥉 ${sorted[2].name} (${sorted[2].points})<br>`;
  }

  document.getElementById("podium").innerHTML = html;
}
function filterRiders(){
  let input = document.getElementById("searchRider").value.toLowerCase();

  let r = document.getElementById("riderSelect");
  r.innerHTML = "";

  availableRiders
    .filter(name => name.toLowerCase().includes(input))
    .forEach(rider=>{
      let opt = document.createElement("option");
      opt.value = rider;
      opt.textContent = rider;
      r.appendChild(opt);
    });
}
function openStageModal(){
  let html = "";

  for(let i=0;i<10;i++){
    html += `<input placeholder="${i+1}. renner" id="m${i}"><br>`;
  }

  document.getElementById("stageInputsModal").innerHTML = html;
  document.getElementById("stageModal").style.display = "block";
}

function closeStageModal(){
  document.getElementById("stageModal").style.display = "none";
}
function resetStage(){
  if(!confirm("Nieuwe rit starten?")) return;

  document.querySelectorAll(".stageHistory")?.forEach(e => e.remove());

  alert("Nieuwe rit gestart 🚴");
}
