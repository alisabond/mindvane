function init() {
    import('./header.js');
    import('./sidebar.js');
    import('./boards.js');
    import('./info.js');
    import('./budget.js');
    import('./footer.js');
}

const totalPartials = document.querySelectorAll('[hx-trigger="load"]').length;
let loadedPartialsCount = 0;

document.body.addEventListener('htmx:afterOnLoad', () => {
    loadedPartialsCount++;

    if (loadedPartialsCount === totalPartials) {
        init();
    }
});

document.body.addEventListener('htmx:afterSwap', (e) => {
    const content = document.querySelector('#content-container');
    if (!content) return;

    // если загрузили boards.html
    if (content.querySelector('.boards-section')) {
        import('./boards.js').then(module => {
            if (typeof module.initBoards === 'function') {
                module.initBoards();
            }
        });
    }
});
