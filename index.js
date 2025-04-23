// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Obtiene referencias a los elementos del DOM que vamos a manipular
    const searchInput = document.getElementById('search-input');           // Input de búsqueda
    const filterButtons = document.querySelectorAll('.filters__button');   // Todos los botones de filtro
    const cards = Array.from(document.querySelectorAll('.card'));         // Convierte NodeList de cards a Array
    const resourcesSection = document.querySelector('.resources');         // Sección contenedora de recursos

    // Variable que almacena el filtro activo actual
    let activeFilter = 'all';

    // Función principal que aplica los filtros de búsqueda y categorías
    function applyFilters() {
        // Obtiene el texto de búsqueda, lo limpia de espacios y lo convierte a minúsculas
        const query = searchInput.value.trim().toLowerCase();
        // Variable para controlar si se encontraron resultados
        let hasResults = false;

        // Itera sobre cada tarjeta para determinar si debe mostrarse
        cards.forEach(card => {
            // Obtiene el texto del título, descripción y etiquetas de la tarjeta
            const title = card.querySelector('.card__title').textContent.toLowerCase();
            const description = card.querySelector('.card__description').textContent.toLowerCase();
            const tags = card.getAttribute('data-tags') || ''; // Si no hay tags, usa string vacío

            // Verifica si la tarjeta coincide con el texto de búsqueda
            const matchesSearch = query === '' ||  // Si no hay búsqueda, coincide
                title.includes(query) ||           // O si el título contiene el texto
                description.includes(query) ||      // O si la descripción contiene el texto
                tags.toLowerCase().includes(query); // O si las etiquetas contienen el texto
                
            // Verifica si la tarjeta coincide con el filtro de categoría activo
            const matchesFilter = activeFilter === 'all' ||  // Si el filtro es 'all', coincide
                tags.split(' ').includes(activeFilter);      // O si tiene la categoría actual

            // Determina si la tarjeta debe mostrarse (debe coincidir con ambos filtros)
            const shouldShow = matchesSearch && matchesFilter;
            // Muestra u oculta la tarjeta según el resultado
            card.style.display = shouldShow ? 'block' : 'none';
            
            // Si al menos una tarjeta se muestra, hay resultados
            if (shouldShow) hasResults = true;
        });

        // Actualiza el mensaje de "no se encontraron resultados"
        updateNoResultsMessage(hasResults);
    }

    // Función que maneja la visualización del mensaje de no resultados
    function updateNoResultsMessage(hasResults) {
        // Busca si ya existe un mensaje de no resultados
        let noResultsMessage = resourcesSection.querySelector('.no-results');
        
        // Si no hay resultados
        if (!hasResults) {
            // Si no existe el mensaje, lo crea
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('p');
                noResultsMessage.className = 'no-results';
                noResultsMessage.textContent = 'No se encontraron resultados';
                noResultsMessage.style.textAlign = 'center';
                noResultsMessage.style.gridColumn = '1 / -1'; // Ocupa todo el ancho del grid
                resourcesSection.appendChild(noResultsMessage);
            }
        } else if (noResultsMessage) {
            // Si hay resultados y existe el mensaje, lo elimina
            noResultsMessage.remove();
        }
    }

    // Implementa debounce en la búsqueda para mejorar el rendimiento
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        // Cancela el temporizador anterior si existe
        clearTimeout(searchTimeout);
        // Establece un nuevo temporizador de 300ms antes de aplicar los filtros
        searchTimeout = setTimeout(applyFilters, 300);
    });

    // Maneja los clics en los botones de filtro
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remueve la clase activa de todos los botones
            filterButtons.forEach(b => {
                b.classList.remove('filters__button--active');
                b.setAttribute('aria-pressed', 'false');  // Actualiza el estado ARIA
            });
            // Añade la clase activa al botón clickeado
            btn.classList.add('filters__button--active');
            btn.setAttribute('aria-pressed', 'true');     // Actualiza el estado ARIA

            // Actualiza el filtro activo y aplica los filtros
            activeFilter = btn.dataset.filter;
            applyFilters();
        });
    });

    // Aplica los filtros al cargar la página
    applyFilters();
});