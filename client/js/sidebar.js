function initSidebarMenu(skipRestore = false) {
    const menuButtons = document.querySelectorAll('.sidebar .menu li button');
    if (!menuButtons.length) return;

    // Назначаем обработчики кликов
    menuButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Удаляем активный класс у всех пунктов
            document.querySelectorAll('.sidebar .menu li').forEach(li => {
                li.classList.remove('active');
            });

            // Добавляем активный класс текущему
            button.parentElement.classList.add('active');

            // Сохраняем индекс активного пункта в localStorage
            localStorage.setItem('activeSidebarIndex', index);
        });
    });

    // Восстанавливаем активный пункт при загрузке страницы (только один раз)
    if (!skipRestore) {
        const savedIndex = localStorage.getItem('activeSidebarIndex');
        if (savedIndex !== null && menuButtons[savedIndex]) {
            const targetButton = menuButtons[savedIndex];
            targetButton.parentElement.classList.add('active');

            // Программно вызываем клик один раз, с задержкой для избежания гонки загрузки
            setTimeout(() => {
                targetButton.dispatchEvent(new Event('click'));
            }, 50);
        }
    }
}

// Инициализируем сразу, если sidebar уже загружен
initSidebarMenu();

// Смотрим на изменения DOM, чтобы повторно назначить события, но не запускать загрузку снова
const observer = new MutationObserver(() => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        initSidebarMenu(true); // true — не загружать контент повторно
    }
});

observer.observe(document.body, { childList: true, subtree: true });
