document.addEventListener('DOMContentLoaded', () => {
    // Auto-advancing slideshow
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    function cycleSlides() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Start automatic rotation (7 seconds per slide)
    let slideInterval = setInterval(cycleSlides, 7000);

    // Pause on hover
    const slider = document.querySelector('.auto-slideshow');
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(cycleSlides, 7000);
    });
});