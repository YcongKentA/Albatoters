
(function(){
 const root=document.documentElement;
 const savedTheme=localStorage.getItem('albatoters-theme');
 if(savedTheme==='light') root.classList.add('light');
 const theme=document.getElementById('themeToggle');
 if(theme) theme.addEventListener('click',()=>{root.classList.toggle('light');localStorage.setItem('albatoters-theme',root.classList.contains('light')?'light':'dark');});
 const menu=document.getElementById('menuToggle'),nav=document.getElementById('siteNav');
 if(menu&&nav) menu.addEventListener('click',()=>nav.classList.toggle('open'));
 const toast=document.getElementById('toast');
 function notify(message){if(!toast)return;toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200);}
 // Mood match recommendations
 const moodData=document.getElementById('moodData');
 if(moodData){
  const data=JSON.parse(moodData.textContent);
  document.querySelectorAll('[data-mood]').forEach(btn=>btn.addEventListener('click',()=>{
   document.querySelectorAll('[data-mood]').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');
   const item=data[btn.dataset.mood],result=document.getElementById('moodResult');
   result.innerHTML='<p class="eyebrow">YOUR LISTENING MATCH</p><h2>'+item.name+'</h2><p class="muted">'+item.desc+'</p><p><strong>Try listening to:</strong> '+item.artists.join(' · ')+'</p><p class="muted">'+item.hint+'</p><a class="btn primary" href="artist.html">EXPLORE ARTISTS ↗</a>';
  }));
 }
 // Artist search
 const search=document.getElementById('artistSearch');
 if(search){const cards=[...document.querySelectorAll('#artistGrid .artist-card')],count=document.getElementById('artistCount'),empty=document.getElementById('artistEmpty');
  search.addEventListener('input',()=>{let shown=0;cards.forEach(card=>{const match=card.dataset.artist.includes(search.value.trim().toLowerCase());card.classList.toggle('hidden',!match);if(match)shown++;});count.textContent=shown+' artist'+(shown===1?'':'s');empty.classList.toggle('hidden',shown!==0);});
 }
 // Story category filters
 const chips=[...document.querySelectorAll('[data-filter]')];
 if(chips.length){const cards=[...document.querySelectorAll('#storyGrid .story-card')],empty=document.getElementById('storyEmpty');
  chips.forEach(chip=>chip.addEventListener('click',()=>{chips.forEach(c=>c.classList.remove('active'));chip.classList.add('active');let shown=0;cards.forEach(card=>{const match=chip.dataset.filter==='all'||card.dataset.category===chip.dataset.filter;card.classList.toggle('hidden',!match);if(match)shown++;});if(empty)empty.classList.toggle('hidden',shown!==0);}));
 }
 // Local listening journal
 const journalForm=document.getElementById('journalForm'),entriesBox=document.getElementById('journalEntries');
 if(journalForm&&entriesBox){
  const key='albatoters-journal-v1';
  function load(){try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){return[]}}
  function render(){const entries=load();entriesBox.innerHTML='<h3 style="margin:24px 0 8px;font-family:Space Grotesk">Saved entries ('+entries.length+')</h3>';
   if(!entries.length){entriesBox.innerHTML+='<div class="empty">Your journal is empty. Save your first listening memory above.</div>';return;}
   entries.forEach((entry,index)=>{const el=document.createElement('article');el.className='entry';const h=document.createElement('h4');h.textContent=entry.title;const meta=document.createElement('small');meta.className='muted';meta.textContent=entry.artist+' · '+entry.mood+' · '+entry.date;const p=document.createElement('p');p.textContent=entry.note;const del=document.createElement('button');del.textContent='Delete';del.type='button';del.addEventListener('click',()=>{const list=load();list.splice(index,1);localStorage.setItem(key,JSON.stringify(list));render();});el.append(del,h,meta,p);entriesBox.append(el);});
  }
  journalForm.addEventListener('submit',e=>{e.preventDefault();const list=load();list.unshift({title:document.getElementById('journalTitle').value.trim(),artist:document.getElementById('journalArtist').value.trim(),mood:document.getElementById('journalMood').value,note:document.getElementById('journalNote').value.trim(),date:new Date().toLocaleDateString()});localStorage.setItem(key,JSON.stringify(list));journalForm.reset();document.getElementById('journalMessage').textContent='Your listening memory has been saved in this browser.';render();});render();
 }
 // Contact form: create a copyable message without inventing a team email address
 const contact=document.getElementById('contactForm');
 if(contact)contact.addEventListener('submit',async e=>{e.preventDefault();const message='ALBATOTERS CONTACT MESSAGE\nName: '+document.getElementById('contactName').value.trim()+'\nEmail: '+document.getElementById('contactEmail').value.trim()+'\nSubject: '+document.getElementById('contactSubject').value.trim()+'\n\n'+document.getElementById('contactMessage').value.trim();
  let status=document.getElementById('contactMessageStatus');
  try{await navigator.clipboard.writeText(message);status.textContent='Your message is ready and copied. Paste it into your email or messaging app to send it to the team.';}
  catch(err){status.textContent='Your message is ready. Copy the details below and paste them into your email or messaging app.';}
  let output=document.getElementById('preparedMessage');if(!output){output=document.createElement('textarea');output.id='preparedMessage';output.className='field';output.readOnly=true;output.rows=7;output.style.marginTop='12px';contact.append(output);}output.value=message;
 });
})();
