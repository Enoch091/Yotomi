// Toggle FAQ answers
function toggleAnswer(question) {
    const item = question.parentElement;
    const isActive = item.classList.contains('active');
    
    // Close all other open items
    document.querySelectorAll('.faq-item.active').forEach(active => {
        if (active !== item) {
            active.classList.remove('active');
        }
    });

    // Toggle this item
    item.classList.toggle('active');
}

// Search functionality
function searchFaqs() {
    const searchInput = document.getElementById('searchFaq');
    const filter = searchInput.value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question span').textContent;
        const answer = item.querySelector('.faq-answer').textContent;
        const matchesSearch = question.toLowerCase().includes(filter) || 
                            answer.toLowerCase().includes(filter);

        item.style.display = matchesSearch ? '' : 'none';

        // Show/hide section headers based on visible items
        const section = item.closest('.faq-section');
        const visibleItems = Array.from(section.querySelectorAll('.faq-item'))
                                .some(item => item.style.display !== 'none');
        section.style.display = visibleItems ? '' : 'none';
    });
}

// WhatsApp functionality
function openWhatsApp() {
    window.open('https://wa.me/2348038701309', '_blank');
}

function goBack() {
    window.history.back();
}

// Initialize search on page load
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchFaq');
    if (searchInput) {
        searchInput.addEventListener('input', searchFaqs);
    }
});