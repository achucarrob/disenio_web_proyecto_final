// JavaScript optimizado para Pymes Soft
// Sin modificar la estructura HTML/CSS existente

(function() {
    'use strict';

    // Variables globales
    let isScrolling = false;
    let ticking = false;

    // Inicialización cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        initializeComponents();
        setupEventListeners();
        setupIntersectionObserver();
        setupFormHandler();
    });

    // Inicializar componentes principales
    function initializeComponents() {
        // Cargar tema guardado
        loadSavedTheme();
        
        // Configurar navegación suave
        setupSmoothScrolling();
        
        // Animar elementos al cargar
        animateOnLoad();
    }

    // Configurar event listeners
    function setupEventListeners() {
        // Toggle de tema
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', handleThemeToggle);
        }

        // Navegación del header
        setupNavigation();

        // Scroll optimizado
        window.addEventListener('scroll', throttle(handleScroll, 16)); // ~60fps

        // Resize optimizado
        window.addEventListener('resize', debounce(handleResize, 250));

        // Hover effects para service items
        setupHoverEffects();
    }

    // Manejo del toggle de tema
    function handleThemeToggle(e) {
        const isNightMode = e.target.checked;
        
        // Guardar preferencia
        localStorage.setItem('pymes-theme', isNightMode ? 'night' : 'day');
        
        // Añadir clase para transición suave
        document.body.classList.add('theme-transitioning');
        
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);

        // Analytics si está disponible
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                'theme': isNightMode ? 'night' : 'day'
            });
        }
    }

    // Cargar tema guardado
    function loadSavedTheme() {
        const savedTheme = localStorage.getItem('pymes-theme');
        const themeToggle = document.getElementById('theme-toggle');
        
        if (savedTheme === 'night' && themeToggle) {
            themeToggle.checked = true;
        }
    }

    // Configurar navegación suave
    function setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Actualizar URL sin scroll
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // Configurar navegación activa
    function setupNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;

        // Crear un map para mejor performance
        const linkMap = new Map();
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            linkMap.set(href, link);
        });

        // Observer para secciones activas
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = '#' + entry.target.id;
                const link = linkMap.get(id);
                
                if (link) {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        // Remover active de todos
                        navLinks.forEach(l => l.classList.remove('active'));
                        // Añadir active al actual
                        link.classList.add('active');
                    }
                }
            });
        }, {
            threshold: [0.5],
            rootMargin: '-20% 0px -20% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    // Intersection Observer para animaciones
    function setupIntersectionObserver() {
        const animatedElements = document.querySelectorAll('.service-item, .case-card, .step, .member, .testimonial');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });

        // Configurar elementos para animación
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }

    // Configurar efectos hover
    function setupHoverEffects() {
        const serviceItems = document.querySelectorAll('.service-item');
        const steps = document.querySelectorAll('.step');
        
        [...serviceItems, ...steps].forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Manejo del scroll
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const header = document.querySelector('header');
                
                // Header effect
                if (header) {
                    if (scrolled > 100) {
                        header.style.backgroundColor = 'var(--panel)';
                        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                    } else {
                        header.style.backgroundColor = 'var(--panel)';
                        header.style.boxShadow = 'none';
                    }
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }

    // Manejo del resize
    function handleResize() {
        // Reajustar elementos si es necesario
        const isMobile = window.innerWidth < 768;
        
        // Ajustar navegación en móvil si es necesario
        const nav = document.querySelector('nav');
        if (nav && isMobile) {
            // Lógica adicional para móvil si se requiere
        }
    }

    // Configurar manejo del formulario
    function setupFormHandler() {
        const form = document.querySelector('.contact-form');
        
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const button = this.querySelector('button[type="submit"]');
                const originalText = button.textContent;
                
                // Estado de carga
                button.textContent = 'Enviando...';
                button.disabled = true;
                
                // Simular envío (reemplazar con tu lógica real)
                setTimeout(() => {
                    // Éxito
                    button.textContent = 'Enviado ✓';
                    button.style.backgroundColor = '#22c55e';
                    
                    // Limpiar formulario
                    this.reset();
                    
                    // Mostrar mensaje de éxito
                    showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
                    
                    // Restaurar botón después de 3 segundos
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.disabled = false;
                        button.style.backgroundColor = '';
                    }, 3000);
                    
                }, 2000);
            });

            // Validación en tiempo real
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearFieldError);
            });
        }
    }

    // Validar campo individual
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remover error previo
        clearFieldError.call(field);
        
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es requerido';
        } else if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
    }

    // Limpiar error de campo
    function clearFieldError() {
        this.style.borderColor = '';
        const errorEl = this.parentNode.querySelector('.field-error');
        if (errorEl) {
            errorEl.remove();
        }
    }

    // Mostrar error de campo
    function showFieldError(field, message) {
        field.style.borderColor = '#dc2626';
        
        const errorEl = document.createElement('div');
        errorEl.className = 'field-error';
        errorEl.textContent = message;
        errorEl.style.cssText = `
            color: #dc2626;
            font-size: 12px;
            margin-top: 4px;
            margin-bottom: 8px;
        `;
        
        field.parentNode.insertBefore(errorEl, field.nextSibling);
    }

    // Validar email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Mostrar notificación
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#22c55e',
            error: '#dc2626',
            info: '#3b82f6'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto-remover
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Animaciones al cargar la página
    function animateOnLoad() {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.opacity = '0';
            hero.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                hero.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                hero.style.opacity = '1';
                hero.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    // Utilidades de performance
    function throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function(...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // API pública (opcional)
    window.PymesSoft = {
        showNotification: showNotification,
        scrollToSection: function(sectionId) {
            const element = document.querySelector(sectionId);
            if (element) {
                const headerHeight = document.querySelector('header').offsetHeight;
                window.scrollTo({
                    top: element.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        }
    };

})();