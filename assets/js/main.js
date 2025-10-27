// Accessibility: fill year
document.getElementById('year').textContent = new Date().getFullYear();

// Add .in to fade-up elements once DOM is ready (simple reveal)
document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.fade-up').forEach(function(el, i){
        setTimeout(function(){ el.classList.add('in') }, 120 * i);
    });
});

// Replace placeholder AFFILIATE_LINK text nodes (optional: ensure anchors have correct href)
(function normalizeAffiliate(){
    const AFF = 'AFFILIATE_LINK';
    document.querySelectorAll('a[href="AFFILIATE_LINK"]').forEach(a=>{
        // If still placeholder, you can set via server-side or JS. Leave it for manual replacement.
        // a.href = 'https://go.hotmart.net/tu-enlace-de-afiliado';
        a.setAttribute('data-affiliate-placeholder', 'true');
    });
})();

// Simple deep-link smooth scroll for in-page navigation
document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
        const targetId = a.getAttribute('href').slice(1);
        const el = document.getElementById(targetId);
        if(el){
            e.preventDefault();
            // Ajuste de scroll: -80px para dejar espacio al header fijo (si existiera) o margen superior.
            window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior:'smooth' });
        }
    });
});

// Optional: open affiliate links in new tab (if added)
document.querySelectorAll('a[href^="http"]').forEach(a=>{
    if(a.getAttribute('href').includes('hotmart') || a.getAttribute('href').includes('go.hotmart')){
        a.setAttribute('target','_blank');
        a.setAttribute('rel','noopener noreferrer');
    }
});

// Accordion behavior (details are native but enhance keyboard)
document.querySelectorAll('details summary').forEach(s=>{
    s.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
            e.preventDefault(); s.parentElement.open = !s.parentElement.open;
        }
    });
});

// Tiny performance tip: defer big images and external scripts; use server-side caching and compress assets.

// ----------------------------------------------------
// CÓDIGO DEL MENÚ RESPONSIVE (AÑADIDO CORRECTAMENTE AQUÍ)
// ----------------------------------------------------
const nav = document.getElementById('main-nav');
const toggle = document.querySelector('.menu-toggle');

if (nav && toggle) { // Verificación añadida para evitar errores si los elementos no se encuentran
    toggle.addEventListener('click', () => {
        // Alterna entre la clase nav-hidden (oculto) y nav-visible (mostrado)
        nav.classList.toggle('nav-visible'); 
        
        // Mejora la accesibilidad (opcional, pero recomendado)
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true' || false;
        toggle.setAttribute('aria-expanded', !isExpanded);
    });
}