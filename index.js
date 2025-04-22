document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filters__button');
    const cards = Array.from(document.querySelectorAll('.card'));
    const resourcesSection = document.querySelector('.resources');

    let activeFilter = 'all';

    function applyFilters() {
        const query = searchInput.value.trim().toLowerCase();
        let hasResults = false;

        cards.forEach(card => {
            const title = card.querySelector('.card__title').textContent.toLowerCase();
            const description = card.querySelector('.card__description').textContent.toLowerCase();
            const tags = card.getAttribute('data-tags') || ''; // Corregido para usar getAttribute

            const matchesSearch = query === '' || 
                title.includes(query) || 
                description.includes(query) || 
                tags.toLowerCase().includes(query);
                
            const matchesFilter = activeFilter === 'all' || 
                tags.split(' ').includes(activeFilter);

            const shouldShow = matchesSearch && matchesFilter;
            card.style.display = shouldShow ? 'block' : 'none';
            
            if (shouldShow) hasResults = true;
        });

        // Actualizar mensaje de no resultados
        updateNoResultsMessage(hasResults);
    }

    function updateNoResultsMessage(hasResults) {
        let noResultsMessage = resourcesSection.querySelector('.no-results');
        
        if (!hasResults) {
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('p');
                noResultsMessage.className = 'no-results';
                noResultsMessage.textContent = 'No se encontraron resultados';
                noResultsMessage.style.textAlign = 'center';
                noResultsMessage.style.gridColumn = '1 / -1';
                resourcesSection.appendChild(noResultsMessage);
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }

    // Evento: búsqueda en tiempo real con debounce
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 300);
    });

    // Evento: clic en botones de filtro
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('filters__button--active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('filters__button--active');
            btn.setAttribute('aria-pressed', 'true');

            activeFilter = btn.dataset.filter;
            applyFilters();
        });
    });

    // Aplicar filtros iniciales
    applyFilters();
});