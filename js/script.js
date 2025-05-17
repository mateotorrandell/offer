// js/script.js
document.addEventListener('DOMContentLoaded', function() {

    // Navegación en Dashboards
    const dashboardNavLinks = document.querySelectorAll('.dashboard-nav ul li a');
    const dashboardContents = document.querySelectorAll('.dashboard-content > div');

    if (dashboardNavLinks.length > 0 && dashboardContents.length > 0) {
        // Función para mostrar la sección activa y ocultar las demás
        function showDashboardSection(targetId) {
            dashboardContents.forEach(content => {
                content.style.display = (content.id === targetId) ? 'block' : 'none';
            });
            dashboardNavLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + targetId);
            });
        }

        // Mostrar la primera sección por defecto o la que tenga el hash en la URL
        let initialSectionId = dashboardNavLinks[0].getAttribute('href').substring(1);
        if (window.location.hash) {
            const hashId = window.location.hash.substring(1);
            const elementExists = Array.from(dashboardNavLinks).some(link => link.getAttribute('href') === '#' + hashId);
            if (elementExists) {
                initialSectionId = hashId;
            }
        }
        showDashboardSection(initialSectionId);


        dashboardNavLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                showDashboardSection(targetId);
                window.location.hash = targetId; // Actualizar URL hash para deep linking/refresh
            });
        });
    }

    // Lógica para Carga de Oferta - Mostrar campo de hora para Flash
    const offerTypeSelect = document.getElementById('offer-type');
    const flashOfferTimeGroup = document.getElementById('flash-offer-time-group');

    if (offerTypeSelect && flashOfferTimeGroup) {
        offerTypeSelect.addEventListener('change', function() {
            if (this.value === 'flash') {
                flashOfferTimeGroup.style.display = 'block';
                flashOfferTimeGroup.querySelector('input[type="time"]').required = true;
            } else {
                flashOfferTimeGroup.style.display = 'none';
                flashOfferTimeGroup.querySelector('input[type="time"]').required = false;
            }
        });
        // Estado inicial
        if (offerTypeSelect.value === 'flash') {
            flashOfferTimeGroup.style.display = 'block';
            flashOfferTimeGroup.querySelector('input[type="time"]').required = true;
        }
    }


    // Countdown Timers para Ofertas Flash (Ejemplo Básico)
    // En una aplicación real, la fecha/hora de finalización vendría del backend
    function startCountdown(elementId, endTimeString) {
        const countdownElement = document.getElementById(elementId);
        if (!countdownElement) return;

        const endTime = new Date(endTimeString).getTime(); // Ejemplo: "May 12, 2025 23:59:59"

        const interval = setInterval(function() {
            const now = new Date().getTime();
            const distance = endTime - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            let countdownText = "Tiempo restante: ";
            if (days > 0) countdownText += days + "d ";
            countdownText += ('0' + hours).slice(-2) + ":" +
                             ('0' + minutes).slice(-2) + ":" +
                             ('0' + seconds).slice(-2);

            countdownElement.innerHTML = countdownText;

            if (distance < 0) {
                clearInterval(interval);
                countdownElement.innerHTML = "¡OFERTA EXPIRADA!";
                countdownElement.style.color = "var(--danger-color)";
                // Opcional: deshabilitar el botón de la oferta
                const offerCard = countdownElement.closest('.offer-card');
                if (offerCard) {
                    offerCard.querySelector('.btn')?.classList.add('disabled');
                    offerCard.querySelector('.btn')?.setAttribute('disabled', 'true');
                }
            }
        }, 1000);
    }

    // Iniciar countdowns para las ofertas flash de ejemplo
    // Debes asegurarte que la fecha/hora sea futura para que funcione el countdown
    // El formato "YYYY-MM-DDTHH:mm:ss" es más robusto para new Date()
    // Ejemplo: para una oferta que termina hoy a las 23:59:59
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Para que expire mañana
    tomorrow.setHours(23,59,59,0);

    const flashEndTime1 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString(); // Hoy a las 23:59:59
    const flashEndTime2 = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 18, 0, 0).toISOString(); // Mañana a las 18:00:00

    if (document.getElementById('countdown-1')) {
        startCountdown('countdown-1', flashEndTime1);
    }
    if (document.getElementById('countdown-2')) {
         startCountdown('countdown-2', flashEndTime2);
    }
    // ... y así para cada oferta flash que tengas con su ID y tiempo de finalización.
    // En una aplicación real, estos datos se generarían dinámicamente.

    // Ejemplo de Chart.js para el panel de comercio (necesitas incluir Chart.js)
    const ctx = document.getElementById('offerPerformanceChart');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line', // o 'bar'
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'], // Meses o días
                datasets: [{
                    label: 'Visualizaciones de Ofertas',
                    data: [650, 590, 800, 810, 960, 1050], // Datos de ejemplo
                    borderColor: 'var(--primary-color)',
                    tension: 0.1,
                    fill: false
                }, {
                    label: 'Clicks en Ofertas',
                    data: [30, 45, 60, 55, 70, 85], // Datos de ejemplo
                    borderColor: 'var(--accent-color)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

});