
document.querySelectorAll('[data-menu]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const nav=document.querySelector('.nav-links');
    nav.style.display=nav.style.display==='flex'?'none':'flex';
    if(nav.style.display==='flex'){nav.style.flexDirection='column';nav.style.position='absolute';nav.style.top='70px';nav.style.right='15px';nav.style.background='#03132f';nav.style.padding='18px';nav.style.borderRadius='6px';}
  });
});
document.querySelectorAll('form[data-demo]').forEach(form=>{
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const msg=form.querySelector('[data-form-msg]');
    if(msg) msg.textContent='Thank you. This demonstration form is not connected to a live submission system yet.';
    form.reset();
  });
});
