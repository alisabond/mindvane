// Инициализация фона с частицами
function initParticles(containerId, config) {
    const canvas = document.createElement('canvas');
    canvas.className = 'pg-canvas';
    canvas.style.display = 'block';
    const container = document.getElementById(containerId);
    container.insertBefore(canvas, container.firstChild);
    const ctx = canvas.getContext('2d');

    const width = container.offsetWidth;
    const height = container.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const particleCount = Math.round((width * height) / config.density);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: config.minSpeedX + Math.random() * (config.maxSpeedX - config.minSpeedX),
            vy: config.minSpeedY + Math.random() * (config.maxSpeedY - config.minSpeedY),
        });
    }

    const draw = () => {
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = config.dotColor;
        ctx.strokeStyle = config.lineColor;
        ctx.lineWidth = config.lineWidth;

        // Рисуем точки
        for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, config.particleRadius, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Рисуем линии между близкими точками
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < config.proximity) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Обновляем координаты
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        requestAnimationFrame(draw);
    };

    draw();
}

// Настройки для фоновых частиц
initParticles('particles-background', {
    dotColor: 'rgba(200,200,200,0.3)',
    lineColor: 'rgba(200,0,0,0.05)',
    minSpeedX: 0.1,
    maxSpeedX: 0.3,
    minSpeedY: 0.1,
    maxSpeedY: 0.3,
    particleRadius: 2,
    lineWidth: 1,
    density: 30000,
    proximity: 50,
});

// Настройки для переднего плана
initParticles('particles-foreground', {
    dotColor: 'rgba(255,255,255,0.4)',
    lineColor: 'rgba(255,0,0,0.1)',
    minSpeedX: 0.2,
    maxSpeedX: 0.4,
    minSpeedY: 0.2,
    maxSpeedY: 0.4,
    particleRadius: 3,
    lineWidth: 1,
    density: 20000,
    proximity: 100,
});

// ✅ Проверка авторизации и редирект
fetch('/api/protected', {
    method: 'GET',
    credentials: 'include'
})
    .then(response => {
        console.log('Ответ от /api/protected:', response.status);
        setTimeout(() => {
            window.location.href = response.ok ? 'index.html' : 'auth.html';
        }, 6000);
    })
    .catch(error => {
        console.error('Ошибка запроса:', error);
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 6000);
    });
