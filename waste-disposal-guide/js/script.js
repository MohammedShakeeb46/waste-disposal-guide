// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const suggestions = document.getElementById('suggestions');
const searchResults = document.getElementById('search-results');
const modal = document.getElementById('item-modal');
const closeBtn = document.querySelector('.close-btn');
const modalTitle = document.getElementById('modal-title');
const modalCategory = document.getElementById('modal-category');
const modalDescription = document.getElementById('modal-description');
const modalDisposal = document.getElementById('modal-disposal');
const modalBinColor = document.getElementById('modal-bin-color');
const modalBinType = document.getElementById('modal-bin-type');
const modalTips = document.getElementById('modal-tips');
const modalContact = document.getElementById('modal-contact');
const modalLocation = document.getElementById('modal-location');
const mobileMenu = document.querySelector('.mobile-menu');
const nav = document.querySelector('nav');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners
    searchBtn.addEventListener('click', searchItems);
    searchInput.addEventListener('input', showSuggestions);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchItems();
    });
    
    // Modal close button
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Mobile menu toggle
    mobileMenu.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
});

// Display search results
function displaySearchResults(items) {
    searchResults.innerHTML = '';
    searchResults.style.display = 'block';
    
    if (items.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No items found</h3>
                <p>Try searching for something else</p>
            </div>
        `;
        return;
    }
    
    const resultsHeader = document.createElement('h2');
    resultsHeader.textContent = `Search Results (${items.length})`;
    searchResults.appendChild(resultsHeader);
    
    const resultsGrid = document.createElement('div');
    resultsGrid.className = 'waste-items';
    
    items.forEach(item => {
        const wasteCard = document.createElement('div');
        wasteCard.className = 'waste-card';
        
        // Determine bin color class based on disposal method
        let binColorClass = '';
        if (item.disposalMethod.includes('Recycle')) binColorClass = 'color-blue';
        else if (item.disposalMethod.includes('Compost')) binColorClass = 'color-green';
        else if (item.disposalMethod.includes('Hazardous')) binColorClass = 'color-red';
        else if (item.disposalMethod.includes('Landfill')) binColorClass = 'color-black';
        else binColorClass = 'color-brown';
        
        wasteCard.innerHTML = `
            <div class="waste-info">
                <span class="waste-category category-${item.category}">${item.category}</span>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="bin-type">
                    <span>Bin:</span>
                    <div class="bin-color ${binColorClass}"></div>
                    <span>${item.binType}</span>
                </div>
                <button class="details-btn">View Details</button>
            </div>
        `;
        
        wasteCard.querySelector('.details-btn').addEventListener('click', () => {
            openItemModal(item);
        });
        
        resultsGrid.appendChild(wasteCard);
    });
    
    searchResults.appendChild(resultsGrid);
}

// Open item modal with contact and location
function openItemModal(item) {
    // Set modal content
    modalTitle.textContent = item.name;
    modalCategory.textContent = item.category;
    modalCategory.className = `item-category category-${item.category}`;
    modalDescription.textContent = item.description;
    modalDisposal.textContent = item.disposalMethod;
    modalTips.textContent = item.tips || 'No specific tips available.';
    modalBinType.textContent = item.binType;
    
    // Set contact and location based on category
    const contactLocation = {
        'organic': {
            contact: '080-23456789 (Compost Hotline)',
            location: 'Nearest Green Waste Facility'
        },
        'recyclable': {
            contact: '080-23456790 (Recycling Center)',
            location: 'Blue Bin Collection Point'
        },
        'hazardous': {
            contact: '080-23456791 (Hazardous Waste)',
            location: 'Special Collection Facility'
        },
        'e-waste': {
            contact: '080-23456792 (E-Waste)',
            location: 'Authorized E-Waste Center'
        },
        'other': {
            contact: '080-23456793 (General Waste)',
            location: 'Landfill or Black Bin'
        }
    };
    
    modalContact.textContent = contactLocation[item.category].contact;
    modalLocation.textContent = contactLocation[item.category].location;
    
    // Set bin color
    modalBinColor.className = 'bin-color';
    if (item.disposalMethod.includes('Recycle')) modalBinColor.classList.add('color-blue');
    else if (item.disposalMethod.includes('Compost')) modalBinColor.classList.add('color-green');
    else if (item.disposalMethod.includes('Hazardous')) modalBinColor.classList.add('color-red');
    else if (item.disposalMethod.includes('Landfill')) modalBinColor.classList.add('color-black');
    else modalBinColor.classList.add('color-brown');
    
    // Show modal
    modal.style.display = 'block';
}

// Search functionality
function searchItems() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        searchResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Please enter a search term</h3>
                <p>Try searching for items like "plastic bottle" or "battery"</p>
            </div>
        `;
        searchResults.style.display = 'block';
        return;
    }
    
    const filteredItems = wasteData.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.description.toLowerCase().includes(searchTerm) ||
        item.disposalMethod.toLowerCase().includes(searchTerm)
    );
    
    displaySearchResults(filteredItems);
    suggestions.classList.remove('show');
}

// Show suggestions
function showSuggestions() {
    const input = searchInput.value.trim().toLowerCase();
    
    if (input.length < 2) {
        suggestions.classList.remove('show');
        return;
    }
    
    const matchedItems = wasteData.filter(item => 
        item.name.toLowerCase().includes(input) || 
        item.category.toLowerCase().includes(input)
    ).slice(0, 5);
    
    if (matchedItems.length > 0) {
        suggestions.innerHTML = matchedItems.map(item => `
            <div class="suggestion-item" data-name="${item.name}">
                <i class="fas fa-${getCategoryIcon(item.category)}"></i> ${item.name}
            </div>
        `).join('');
        
        suggestions.classList.add('show');
        
        // Add click event to suggestion items
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                searchInput.value = item.dataset.name;
                searchItems();
            });
        });
    } else {
        suggestions.classList.remove('show');
    }
}

// Get icon for category
function getCategoryIcon(category) {
    switch(category) {
        case 'organic': return 'leaf';
        case 'recyclable': return 'recycle';
        case 'hazardous': return 'biohazard';
        case 'e-waste': return 'laptop';
        default: return 'trash';
    }
}