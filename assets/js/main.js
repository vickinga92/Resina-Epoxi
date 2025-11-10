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

//IMPLEMENTACIÓN DE COOKIES

document.addEventListener('DOMContentLoaded', function() {
    const banner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('accept-cookies');
    const rejectButton = document.getElementById('reject-cookies');
    const cookieName = 'cookie_consent_status';
    const cookieExpiryDays = 365;
    
    // ⚠️ IMPORTANTE: REEMPLAZA 'G-XXXXXXXXXX' con tu ID de Medición de Google Analytics 4 (GA4)
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; 

    // --- Funciones de Gestión de Cookies ---

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        // path=/ asegura que la cookie esté disponible en todo el sitio
        document.cookie = name + "=" + (value || "") + expires + "; path=/; Secure; SameSite=Lax";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // --- Lógica de Carga de Scripts de Terceros ---

    function loadTrackingScripts() {
        console.log('Consentimiento aceptado. Cargando Google Analytics...');
        
        // 1. Cargar la librería principal de Google Analytics (gtag.js)
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        // 2. Inicializar la capa de datos y el seguimiento (gtag)
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        // 3. Configurar el seguimiento
        gtag('config', GA_MEASUREMENT_ID);
        
        // Aquí podrías añadir otros scripts de seguimiento (Meta Pixel, etc.)
    }

    // --- Manejo del Consentimiento y Estado ---

    function handleConsent(status) {
        // 1. Guarda la elección del usuario
        setCookie(cookieName, status, cookieExpiryDays);
        
        // 2. Oculta el banner
        banner.classList.remove('visible');
        setTimeout(() => { banner.style.display = 'none'; }, 500); // Ocultar después de la animación
        
        // 3. Carga condicional de scripts
        if (status === 'accepted') {
            loadTrackingScripts();
        } else {
            console.log('Cookies rechazadas. Scripts de seguimiento bloqueados.');
        }
    }

    // --- Inicialización y Comprobación de Estado ---
    const consent = getCookie(cookieName);

    if (!consent) {
        // No hay cookie de consentimiento, mostrar el banner
        banner.style.display = 'block';
        // Mostrar con un pequeño retraso para asegurar la animación CSS
        setTimeout(() => {
            banner.classList.add('visible');
        }, 100);
    } else if (consent === 'accepted') {
        // Ya aceptó, cargar los scripts de seguimiento inmediatamente
        loadTrackingScripts();
    } else {
        // Ya rechazó, mantener scripts bloqueados y banner oculto
        banner.style.display = 'none';
        console.log('Consentimiento previo: Rechazado.');
    }

    // --- Manejadores de Eventos de Botones ---
    acceptButton.addEventListener('click', () => {
        handleConsent('accepted');
    });

    rejectButton.addEventListener('click', () => {
        handleConsent('rejected');
    });
});
