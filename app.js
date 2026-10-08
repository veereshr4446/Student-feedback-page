const API='https://script.google.com/macros/s/AKfycbyd8YHPGlBy71wieBP0JL3NtHNPiBK09wU5W4gkPzR0OjVoh4MOOkKQs0Fw5wE0Cyfr0w/exec';
const M=['','Very Poor','Poor','Needs Improvement','Below Average','Average','Satisfactory','Good','Very Good','Excellent','Outstanding'];
const BR=['Computer Science & Engineering','CSE (AI & Machine Learning)','CSE (Cyber Security)','CSE (Data Science)','Information Science & Engineering','Electronics & Communication Engineering','Electrical & Electronics Engineering','Mechanical Engineering','Civil Engineering'];
let C={faculty:[],subjects:[]},S={rating:0},$=i=>document.getElementById(i);
const call=b=>fetch(API,{method:'POST',body:JSON.stringify(b)}).then(r=>r.json());
$('sem').innerHTML=[1,2,3,4,5,6,7,8].map(n=>`<option value="${n}">${n}${['st','nd','rd'][n-1]||'th'} Semester</option>`).join('');
$('branch').innerHTML=BR.map(b=>`<option>${b}</option>`).join('');
$('rate').innerHTML=M.slice(1).map((_,i)=>`<button type="button" aria-label="${i+1} stars" onclick="pick(${i+1})"><span>★</span><small>${i+1}</small></button>`).join('');
call({action:'catalog'}).then(d=>{C=d;list()}).catch(()=>{});
function go(n){document.querySelectorAll('section').forEach(s=>s.classList.add('hide'));$('s'+n).classList.remove('hide');scrollTo(0,0)}
function next1(){const u=$('usn').value.trim().toUpperCase().replace(/[\s-]/g,'');
 if(!$('name').value.trim())return $('e1').textContent='Enter your full name.';
 if(!/^[0-9][A-Z]{2}[0-9]{2}[A-Z]{2,3}[0-9]{3}$/.test(u)&&!/^[A-Z][0-9]{1,3}$/.test(u))return $('e1').textContent='Enter your USN (like 1RY23CS001) or roll number (like A52).';
 $('e1').textContent='';go(2)}
function list(){const d=[...new Set(C.faculty.map(x=>x.dept))];
 $('dept').innerHTML='<option value="">Select department</option>'+d.map(x=>`<option>${esc(x)}</option>`).join('');fillFac()}
function fillFac(){const d=$('dept').value;
 $('fac').innerHTML='<option value="">'+(d?'Select faculty':'Select department first')+'</option>'+C.faculty.filter(x=>x.dept===d).map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}
function next2(){if(!$('fac').value)return $('e2').textContent='Select your department and faculty.';$('e2').textContent='';selF($('fac').value)}
function selF(id){S.fid=id;$('fn').textContent=C.faculty.find(x=>x.id===id).name;
 $('dl').innerHTML=C.subjects.filter(x=>x.fid===id).map(x=>`<option value="${esc(x.name)}">`).join('');$('sub').value='';go(3)}
function next3(){const v=$('sub').value.trim().replace(/\s+/g,' ');
 if(v.length<2)return $('e3').textContent='Type the subject name, for example Data Structures.';
 S.subject=v;$('e3').textContent='';go(4)}
function pick(n){S.rating=n;document.querySelectorAll('#rate button').forEach((b,i)=>b.classList.toggle('on',i<n));$('mean').textContent=n+' · '+M[n]}
async function submit(){const c=$('cm').value.trim();
 if(!S.rating)return $('e4').textContent='Choose a rating from 1 to 10.';
 if(!c)return $('e4').textContent='Write a few words of feedback.';
 $('sb').disabled=true;$('e4').textContent='';
 try{const r=await call({action:'submit',name:$('name').value.trim(),usn:$('usn').value.trim(),sem:$('sem').value,branch:$('branch').value,fid:S.fid,subject:S.subject,anon:$('anon').checked,rating:S.rating,comment:c});
  if(r.error)throw new Error(r.error);go(5)}
 catch(e){$('e4').textContent=e.message==='Failed to fetch'?'No connection. Check your network and submit again.':e.message;$('sb').disabled=false}}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
