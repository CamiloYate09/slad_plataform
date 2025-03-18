const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".container .letter-s", {
  duration: 1000,
  delay: 1000,
});
ScrollReveal().reveal(".container img", {
  duration: 1000,
  delay: 1500,
});
ScrollReveal().reveal(".container .text__left", {
  ...scrollRevealOption,
  origin: "right",
  delay: 2000,
});
ScrollReveal().reveal(".container .text__right", {
  ...scrollRevealOption,
  origin: "left",
  delay: 2000,
});
ScrollReveal().reveal(".container .explore", {
  duration: 1000,
  delay: 2500,
});
ScrollReveal().reveal(".container h5", {
  duration: 1000,
  interval: 500,
  delay: 3000,
});
ScrollReveal().reveal(".container .catalog", {
  duration: 1000,
  delay: 5000,
});
ScrollReveal().reveal(".container .print", {
  duration: 1000,
  delay: 5500,
});
ScrollReveal().reveal(".footer p", {
  duration: 1000,
  delay: 7000,
});

document.addEventListener('DOMContentLoaded', function() {
    const backgrounds = document.querySelectorAll('.bg-slide');
    let currentIndex = 0;

    function changeBackground() {
        // Remover la clase active de todos los fondos
        backgrounds.forEach(bg => bg.classList.remove('active'));
        
        // Incrementar el índice
        currentIndex = (currentIndex + 1) % backgrounds.length;
        
        // Añadir la clase active al siguiente fondo
        backgrounds[currentIndex].classList.add('active');
    }

    // Cambiar el fondo cada 5 segundos
    setInterval(changeBackground, 5000);
});
