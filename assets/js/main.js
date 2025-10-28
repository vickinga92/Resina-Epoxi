// Accessibility: fill year (Asegúrate de tener un elemento con id="year" en tu HTML, ej: <footer><span id="year"></span></footer>)
document.getElementById('year').textContent = new Date().getFullYear();

// -------------------------------------------------------------------------
// Lógica que requiere que el DOM esté completamente cargado (Consolidado)
// -------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // 1. Efecto Fade-Up (Revelar elementos con animación)
    document.querySelectorAll('.fade-up').forEach(function(el, i) {
        // Retraso escalonado para un efecto visual agradable
        setTimeout(function() { el.classList.add('in'); }, 120 * i);
    });

    // 2. Lógica del Menú Responsive y Accesibilidad (ARIA)
    const nav = document.getElementById('main-nav');
    const toggle = document.querySelector('.menu-toggle');
    const close = document.querySelector('.menu-close'); // Botón 'X'

    // Verificar que los elementos esenciales existan
    if (nav && toggle) {
        const setMenuState = (isVisible) => {
            nav.classList.toggle('nav-visible', isVisible);
            toggle.setAttribute('aria-expanded', isVisible);
        };

        // Evento Abrir Menú (Botón Hamburguesa)
        toggle.addEventListener('click', () => {
            // Usa el toggle para alternar (si no hay CSS para nav-hidden, puedes usar setMenuState(true))
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            setMenuState(!isExpanded);
        });

        // Evento Cerrar Menú (Botón 'X')
        if (close) {
            close.addEventListener('click', () => setMenuState(false));
        }

        // Cierre automático al hacer clic en un enlace interno (Mejora UX en móvil)
        nav.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('nav-visible')) {
                    setMenuState(false);
                }
            });
        });
    }

}); // Fin: DOMContentLoaded

// -------------------------------------------------------------------------
// Lógica de Scroll y Enlaces (No requiere DOMContentLoaded si se pone al final del <body>)
// -------------------------------------------------------------------------

// Simple deep-link smooth scroll for in-page navigation (Ajustado)
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        const targetId = a.getAttribute('href').slice(1);
        const el = document.getElementById(targetId);
        if (el) {
            e.preventDefault();
            // Ajuste de scroll: -80px para dejar espacio al header fijo
            window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        }
    });
});

// Optional: open affiliate links in new tab (Añade rel="noopener noreferrer" por seguridad)
document.querySelectorAll('a[href^="http"]').forEach(a => {
    if (a.getAttribute('href').includes('hotmart') || a.getAttribute('href').includes('go.hotmart') || a.getAttribute('href').includes('amzn.to')) { // Añadido filtro para Amazon
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer'); // Importante por seguridad y rendimiento
    }
});

// Accordion behavior (Mejora la navegación por teclado en los <details>)
document.querySelectorAll('details summary').forEach(s => {
    s.addEventListener('keydown', function(e) {
        // Permite abrir/cerrar con Enter o Espacio
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            s.parentElement.open = !s.parentElement.open;
        }
    });
});

// Elimina el código de normalización de afiliados si ya lo gestionaste en el HTML
