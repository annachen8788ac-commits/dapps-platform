
const menu=document.querySelector('[data-menu]');
const nav=document.querySelector('.nav-links');
if(menu&&nav){menu.addEventListener('click',()=>{nav.classList.toggle('open');menu.setAttribute('aria-expanded',nav.classList.contains('open'));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));}
const normalizePath=value=>{
 const url=new URL(value,location.origin);
 return url.pathname.replace(/\/index\.html$/,'/').replace(/\/+$/,'/')||'/';
};
const page=normalizePath(location.pathname);
document.querySelectorAll('.nav-links a').forEach(a=>{if(normalizePath(a.href)===page)a.classList.add('active');});

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

const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduceMotion&&'IntersectionObserver' in window){
 document.documentElement.classList.add('motion-ready');
 const motionTargets=document.querySelectorAll([
  '.split-image',
  '.image-strip-main',
  '.image-strip-side',
  '.image-strip-detail',
  '.workspace',
  '.feature',
  '.card',
  '.cap',
  '.verification-card',
  '.verification-link',
  '.foundation-card',
  '.career-job-card',
  '.executive-card',
  '.benefit-card',
  '.intelligence-card'
 ].join(','));
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting){
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
   }
  });
 },{threshold:.12,rootMargin:'0px 0px -6%'});
 motionTargets.forEach(target=>observer.observe(target));
}
