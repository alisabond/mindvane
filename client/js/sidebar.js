function initSidebarMenu() {
    const menuButtons = document.querySelectorAll('.sidebar .menu li button');
    if (!menuButtons.length) return;

    menuButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Удалить активный класс у всех
            document.querySelectorAll('.sidebar .menu li').forEach(li => {
                li.classList.remove('active');
            });

            // Добавить активный класс текущему
            button.parentElement.classList.add('active');

            // Сохранить выбранный пункт
            localStorage.setItem('activeSidebarIndex', index);
        });
    });

    // Программный клик по сохранённому пункту
    const savedIndex = localStorage.getItem('activeSidebarIndex');
    if (savedIndex !== null && menuButtons[savedIndex]) {
        menuButtons[savedIndex].click();
    }
}

// Инициализировать сразу, если sidebar уже загружен
initSidebarMenu();

// Инициализировать при подгрузке sidebar
const observer = new MutationObserver(() => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        initSidebarMenu();
    }
});
observer.observe(document.body, { childList: true, subtree: true });
