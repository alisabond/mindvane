function initInfoWidgets() {

    const weatherContent = document.getElementById('weather-content');
    const currencyContent = document.getElementById('currency-content');
    const newsContent = document.getElementById('news-content');
    const quoteContent = document.getElementById('quote-content');
    const timeContent = document.getElementById('time-content');

    console.log('Weather element:', weatherContent ? 'FOUND' : 'NOT FOUND');
    console.log('Currency element:', currencyContent ? 'FOUND' : 'NOT FOUND');
    console.log('News element:', newsContent ? 'FOUND' : 'NOT FOUND');
    console.log('Quote element:', quoteContent ? 'FOUND' : 'NOT FOUND');
    console.log('Time element:', timeContent ? 'FOUND' : 'NOT FOUND');

    // If there are no elements, exit
    if (!weatherContent && !currencyContent && !newsContent && !quoteContent && !timeContent) {
        console.log('No info widgets found, skipping initialization');
        return;
    }

    // Loading widgets
    setTimeout(function() {
        if (weatherContent) {
            console.log('Loading weather...');
            weatherContent.innerHTML = `
                <div class="weather-info">
                    <div class="weather-location">Odesa, UA</div>
                    <div class="weather-temp">22°C</div>
                    <div class="weather-desc">partly cloudy</div>
                    <div class="weather-details">
                        <div class="weather-detail">
                            <div class="weather-detail-label">Feels like</div>
                            <div class="weather-detail-value">24°C</div>
                        </div>
                        <div class="weather-detail">
                            <div class="weather-detail-label">Humidity</div>
                            <div class="weather-detail-value">65%</div>
                        </div>
                        <div class="weather-detail">
                            <div class="weather-detail-label">Wind</div>
                            <div class="weather-detail-value">12 km/h</div>
                        </div>
                        <div class="weather-detail">
                            <div class="weather-detail-label">Pressure</div>
                            <div class="weather-detail-value">1013 hPa</div>
                        </div>
                    </div>
                </div>
            `;
            console.log('Weather loaded!');
        }
    }, 500);

    setTimeout(function() {
        if (currencyContent) {
            console.log('Loading currency...');
            currencyContent.innerHTML = `
                <div class="currency-list">
                    <div class="currency-item">
                        <div class="currency-pair">USD/UAH</div>
                        <div>
                            <div class="currency-rate">36.85</div>
                            <div class="currency-change positive">+0.12</div>
                        </div>
                    </div>
                    <div class="currency-item">
                        <div class="currency-pair">EUR/UAH</div>
                        <div>
                            <div class="currency-rate">39.67</div>
                            <div class="currency-change negative">-0.08</div>
                        </div>
                    </div>
                    <div class="currency-item">
                        <div class="currency-pair">BTC/USD</div>
                        <div>
                            <div class="currency-rate">43,250</div>
                            <div class="currency-change positive">+1,250</div>
                        </div>
                    </div>
                </div>
            `;
            console.log('Currency loaded!');
        }
    }, 1000);

    setTimeout(function() {
        if (newsContent) {
            console.log('Loading news...');
            newsContent.innerHTML = `
                <div class="news-list">
                    <div class="news-item">
                        <div class="news-title">Global Technology Conference Announces Revolutionary AI Breakthrough</div>
                        <div class="news-meta">
                            <span class="news-source">TechNews</span>
                            <span class="news-time">2 hours ago</span>
                        </div>
                    </div>
                    <div class="news-item">
                        <div class="news-title">Climate Summit Reaches Historic Agreement on Carbon Emissions</div>
                        <div class="news-meta">
                            <span class="news-source">Environmental Times</span>
                            <span class="news-time">4 hours ago</span>
                        </div>
                    </div>
                    <div class="news-item">
                        <div class="news-title">Space Mission Successfully Lands on Mars</div>
                        <div class="news-meta">
                            <span class="news-source">Space Daily</span>
                            <span class="news-time">6 hours ago</span>
                        </div>
                    </div>
                </div>
            `;
            console.log('News loaded!');
        }
    }, 1500);

    setTimeout(function() {
        if (quoteContent) {
            console.log('Loading quote...');
            const quotes = [
                { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
                { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
                { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
            ];

            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            quoteContent.innerHTML = `
                <div class="quote-text">"${randomQuote.text}"</div>
                <div class="quote-author">— ${randomQuote.author}</div>
            `;
            console.log('Quote loaded!');
        }
    }, 2000);

    // Время - сразу и каждую секунду
    if (timeContent) {
        console.log('Setting up time widget...');

        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            const dateString = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const timeEl = document.getElementById('current-time');
            const dateEl = document.getElementById('current-date');
            const timezoneEl = document.getElementById('timezone');

            if (timeEl) timeEl.textContent = timeString;
            if (dateEl) dateEl.textContent = dateString;
            if (timezoneEl) timezoneEl.textContent = 'Europe/Kiev';
        }

        updateTime();
        setInterval(updateTime, 1000);
    }

    setupRadio();
}

// Radio functions
let currentAudio = null;
let isPlaying = false;
let currentStation = null;

function setupRadio() {
    console.log('Setting up radio...');

    const playBtn = document.getElementById('play-pause-btn');
    if (!playBtn) {
        console.log('Radio elements not found');
        return;
    }

    const stationButtons = document.querySelectorAll('.station-btn');
    stationButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            selectStation(this);
        });
    });

    // Play/pause
    playBtn.addEventListener('click', togglePlayPause);

    // Volume
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', updateVolume);
    }

    console.log('Radio setup complete!');
}

function selectStation(button) {
    document.querySelectorAll('.station-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });

    button.classList.add('active');

    const url = button.getAttribute('data-url');
    const name = button.getAttribute('data-name');

    currentStation = { url: url, name: name };

    const stationEl = document.getElementById('current-station');
    const nowPlayingEl = document.getElementById('now-playing');

    if (stationEl) stationEl.textContent = name;
    if (nowPlayingEl) nowPlayingEl.textContent = 'Ready to play';

    // Stop old audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
        isPlaying = false;
        updatePlayButton();
    }
}

function togglePlayPause() {
    if (!currentStation) {
        alert('Select a radio station first');
        return;
    }

    if (isPlaying) {
        // Pause
        if (currentAudio) {
            currentAudio.pause();
            isPlaying = false;
            const nowPlayingEl = document.getElementById('now-playing');
            if (nowPlayingEl) nowPlayingEl.textContent = 'Paused';
        }
    } else {
        // Play
        if (currentAudio) {
            currentAudio.pause();
        }

        try {
            currentAudio = new Audio(currentStation.url);
            currentAudio.volume = 0.5;

            currentAudio.onplay = function() {
                isPlaying = true;
                const nowPlayingEl = document.getElementById('now-playing');
                if (nowPlayingEl) nowPlayingEl.textContent = 'Now playing';
                updatePlayButton();
            };

            currentAudio.onerror = function() {
                const nowPlayingEl = document.getElementById('now-playing');
                if (nowPlayingEl) nowPlayingEl.textContent = 'Stream error';
                isPlaying = false;
                updatePlayButton();
            };

            const nowPlayingEl = document.getElementById('now-playing');
            if (nowPlayingEl) nowPlayingEl.textContent = 'Loading...';

            currentAudio.play().then(function() {
                console.log('Audio started');
            }).catch(function(error) {
                console.log('Play failed:', error.name);
                const nowPlayingEl = document.getElementById('now-playing');
                if (nowPlayingEl) {
                    if (error.name === 'NotAllowedError') {
                        nowPlayingEl.textContent = 'Click to allow audio';
                    } else {
                        nowPlayingEl.textContent = 'Failed to play';
                    }
                }
            });

        } catch (error) {
            console.log('Audio creation failed:', error);
            const nowPlayingEl = document.getElementById('now-playing');
            if (nowPlayingEl) nowPlayingEl.textContent = 'Audio not supported';
        }
    }

    updatePlayButton();
}

function updatePlayButton() {
    const playBtn = document.getElementById('play-pause-btn');
    if (playBtn) {
        const icon = playBtn.querySelector('i');
        if (icon) {
            if (isPlaying) {
                icon.className = 'fas fa-pause';
            } else {
                icon.className = 'fas fa-play';
            }
        }
    }
}

function updateVolume() {
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider && currentAudio) {
        currentAudio.volume = volumeSlider.value / 100;
    }
}

window.addEventListener('load', function() {
    console.log('Window loaded - checking for info widgets...');
    initInfoWidgets();
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready - checking for info widgets...');
    initInfoWidgets();
});

document.body.addEventListener('htmx:afterSwap', function(evt) {
    console.log('HTMX afterSwap - checking for info widgets...');
    setTimeout(function() {
        initInfoWidgets();
    }, 100);
});

document.body.addEventListener('htmx:afterSettle', function(evt) {
    console.log('HTMX afterSettle - checking for info widgets...');
    setTimeout(function() {
        initInfoWidgets();
    }, 200);
});

setTimeout(function() {
    console.log('Delayed check - looking for info widgets...');
    initInfoWidgets();
}, 1000);

setTimeout(function() {
    console.log('Final delayed check - looking for info widgets...');
    initInfoWidgets();
}, 3000);

window.initInfoWidgets = initInfoWidgets;

