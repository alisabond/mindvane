function init() {
    import('./header.js');

}

const totalPartials = document.querySelectorAll('[hx-trigger="load"]').length;
let loadedPartialsCount = 0;

document.body.addEventListener('htmx:afterOnLoad', () => {
    loadedPartialsCount++;
    if (loadedPartialsCount === totalPartials) init();
});


document.body.addEventListener('htmx:afterOnLoad', init);
