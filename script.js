document.addEventListener("DOMContentLoaded",()=>{
const intro=document.getElementById("intro");const main=document.getElementById("main");
setTimeout(()=>{intro.style.display="none";main.classList.remove("hidden")},4000);
const dataTable=document.getElementById("dataTable").querySelector("tbody"),finalOutput=document.getElementById("finalOutput"),
copyBtn=document.getElementById("copyBtn"),copyAlert=document.getElementById("copyAlert"),addRowBtn=document.getElementById("addRow");

// OCR Placeholder (upload/ctrl+v)
const fileInput=document.getElementById("fileInput");
document.addEventListener("paste",e=>{if(e.clipboardData.files.length){fileInput.files=e.clipboardData.files}});

function createRow(name="",code="",state="في الخدمة",location="لا شيء"){const row=document.createElement("tr");
row.innerHTML=`<td>${name}</td><td>${code}</td>
<td><select>
<option ${state==="في الخدمة"?"selected":""}>في الخدمة</option>
<option ${state==="مشغول"?"selected":""}>مشغول</option>
<option ${state==="مشغول - تدريب"?"selected":""}>مشغول - تدريب</option>
<option ${state==="مشغول - اختبار"?"selected":""}>مشغول - اختبار</option>
<option ${state==="مشتركة"?"selected":""}>مشتركة</option>
<option ${state==="سبيد يونت"?"selected":""}>سبيد يونت</option>
<option ${state==="دباب"?"selected":""}>دباب</option>
<option ${state==="خارج الخدمة"?"selected":""}>خارج الخدمة</option>
</select></td>
<td><select>
<option ${location==="لا شيء"?"selected":""}>لا شيء</option>
<option>الشمال</option><option>الجنوب</option><option>الشرق</option><option>الغرب</option>
<option>وسط</option><option>ساندي</option><option>بوليتو</option></select></td>
<td><button class="btn-edit" onclick="editRow(this)">✏️ تعديل</button>
<button class="btn-delete" onclick="deleteRow(this)">🗑️ حذف</button></td>`;return row}

addRowBtn.addEventListener("click",()=>{const row=createRow();dataTable.appendChild(row);updateFinalOutput()});

function buildLine(r){let line=`${r.name} ${r.code}`;
if(r.state!=="في الخدمة"&&r.state!=="خارج الخدمة")line+=` (${r.state})`;
if(r.location!=="لا شيء")line+=` - (${r.location})`;return line}

function updateFinalOutput(){
let rows=[...dataTable.rows].map(r=>({name:r.cells[0].innerText,code:r.cells[1].innerText,
state:r.cells[2].querySelector("select").value,location:r.cells[3].querySelector("select").value}));

const inService=rows.filter(r=>r.state==="في الخدمة"),
busy=rows.filter(r=>r.state.includes("مشغول")),
shared=rows.filter(r=>r.state==="مشتركة"),
speed=rows.filter(r=>r.state==="سبيد يونت"),
bikes=rows.filter(r=>r.state==="دباب"),
outService=rows.filter(r=>r.state==="خارج الخدمة");

let result=`<div class='section-box'><b>📌 استلام العمليات 📌</b></div>`;
if(inService.length){result+=`<div class='section-box inService'><b>عدد واسماء الوحدات في الميدان : (${inService.length})</b><br>`;
inService.forEach(r=>result+=buildLine(r)+"<br>");result+=`</div>`}
if(busy.length){result+=`<div class='section-box busy'><b>مشغول :</b><br>`;
busy.forEach(r=>result+=buildLine(r)+"<br>");result+=`</div>`}
if(speed.length){result+=`<div class='section-box speed'><b>وحدات سبيد يونت :</b><br>`;
speed.forEach(r=>result+=buildLine(r)+"<br>");result+=`</div>`}
if(bikes.length){result+=`<div class='section-box bikes'><b>وحدات دباب :</b><br>`;
bikes.forEach(r=>result+=buildLine(r)+"<br>");result+=`</div>`}
if(shared.length){result+=`<div class='section-box shared'><b>وحدات مشتركة :</b><br>`;
for(let i=0;i<shared.length;i+=2){let first=shared[i]?buildLine(shared[i]):"",second=shared[i+1]?buildLine(shared[i+1]):"";
result+=`${first} + ${second}<br>`}result+=`</div>`}
result+=`<div class='section-box outService'><b>خارج الخدمة : (${outService.length})</b><br>`;
if(outService.length){outService.forEach(r=>result+=buildLine(r)+"<br>")}else{result+="(0)<br>"}result+=`</div>`;
finalOutput.innerHTML=result}

copyBtn.addEventListener("click",()=>{navigator.clipboard.writeText(finalOutput.innerText).then(()=>{
copyAlert.classList.remove("hidden");setTimeout(()=>copyAlert.classList.add("hidden"),2000)})});

window.editRow=function(btn){const row=btn.parentElement.parentElement;
for(let i=0;i<2;i++){const cell=row.cells[i];const value=cell.innerText;cell.innerHTML=`<input type="text" value="${value}">`}
btn.textContent="✔️ حفظ";btn.className="btn-save";btn.onclick=()=>saveRow(btn)};

window.saveRow=function(btn){const row=btn.parentElement.parentElement;
for(let i=0;i<2;i++){const input=row.cells[i].querySelector("input");row.cells[i].innerText=input.value}
btn.textContent="✏️ تعديل";btn.className="btn-edit";btn.onclick=()=>editRow(btn);updateFinalOutput()};

window.deleteRow=function(btn){btn.parentElement.parentElement.remove();updateFinalOutput()};});