
const menu=document.querySelector('[data-menu]');
const nav=document.querySelector('.nav-links');
if(menu&&nav){menu.addEventListener('click',()=>{nav.classList.toggle('open');menu.setAttribute('aria-expanded',nav.classList.contains('open'));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));}
const page=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.nav-links a').forEach(a=>{if(a.getAttribute('href')===page)a.classList.add('active');});

document.querySelectorAll('form[data-mailto]').forEach(form=>{
 form.addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(form); const subject=data.get('subject')||'Website inquiry';
  const lines=[]; for(const [k,v] of data.entries()){if(k!=='subject'&&v) lines.push(`${k}: ${v}`)}
  const href=`mailto:${form.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  const msg=form.querySelector('.form-msg'); if(msg) msg.textContent='Opening your email app with the completed inquiry…';
  window.location.href=href;
 });
});
const year=document.querySelector('[data-year]'); if(year) year.textContent=new Date().getFullYear();
