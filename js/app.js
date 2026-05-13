/**
 * app.js - UI Controller
 */
window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") toggleAbout(false);
});

window.addEventListener('load', () => {
    if (typeof initRippleEngine === 'function') initRippleEngine();

    const closeStoryBtn = document.getElementById('close-overlay');
    if (closeStoryBtn) closeStoryBtn.onclick = () => toggleAbout(false);

    document.querySelectorAll('.lang-link').forEach(link => {
        link.onclick = () => updateStory(link.id);
    });

    renderNav('main');
});

function updateStory(langId) {
    const container = document.querySelector('.story-container');

    const themes = {
        'lang-ta': { content: TA_STORY, color: '#D9791A', bg: '#FFF5E6', font: "'Tiro Tamil', serif" },             // Saffron on peach
        'lang-en': { content: EN_STORY, color: '#06038D', bg: '#FFFFFF', font: "'Quicksand', sans-serif" },         // Navy Blue on white
        'lang-hi': { content: HI_STORY, color: '#138808', bg: '#F0F9F0', font: "'Laila', serif" }   // Green on mint
    };

    const theme = themes[langId] || themes['lang-en'];

    document.querySelectorAll('.lang-link').forEach(link => link.classList.toggle('active', link.id === langId));

    processSequence([
        { millis: 300, fx: () => container.classList.add('faded') }, 
        { millis: 250, fx: () => {
                           Object.assign(container, { innerHTML: theme.content, scrollTop: 0 });
                           container.style.color = theme.color;
                           container.style.background = theme.bg;
                           container.style.fontFamily = theme.font;
                       }
	}, 
        { millis: 0, fx: () => container.classList.remove('faded') }
    ]);
}

// Handle state change between Community and Main -------------------------------------

const navStates = {
    main: {
        icon: 'img/icon.webp',
        links: [
            { id: 'nav-dl', text: 'Download App', href: 'https://play.google.com/store/apps/details?id=com.saraswati.tuner', type: 'link' },
            { id: 'nav-yt', text: 'Watch Tutorials', href: 'https://youtube.com/@SaraswatiTuner', type: 'link' },
            { id: 'nav-comm', text: 'Community', href: '#', type: 'state', target: 'community' },
            { id: 'nav-about', text: 'About Saraswati', href: '#', type: 'action', fx: showAbout }
        ]
    },
    community: {
        icon: 'img/demo-snaps.webp',
        links: [
            { id: 'nav-dl', text: 'On Reddit', href: 'https://www.reddit.com/r/Saraswati_Tuner/', type: 'link' },
            { id: 'nav-yt', text: 'On Facebook', href: 'https://www.facebook.com/SaraswatiTuner', type: 'link' },
            { id: 'nav-comm', text: 'Back to Main', href: '#', type: 'state', target: 'main' },
            { id: 'nav-about', text: 'On Google Groups', href: 'https://groups.google.com/g/saraswati-tuner', type: 'link' }
        ]
    }
};

/**
 * Swap the content of the nav items.
 */
function applyNavState(stateObj) {
    const iconEl = document.querySelector('.center-icon');
    if (iconEl) iconEl.src = stateObj.icon;

    stateObj.links.forEach(item => {
        const el = document.getElementById(item.id);
        if (!el) return;

        // Set core attributes
        el.innerText = item.text;
        el.href = item.href;
        el.target = item.type === 'link' ? "_blank" : "_self";
        if (item.type === 'link') el.rel = "noopener noreferrer";

        // Reset listener
        el.onclick = null;

        // Only attach listeners for internal states or actions
        if (item.type === 'state') {
            el.onclick = (e) => { e.preventDefault(); renderNav(item.target); };
        } else if (item.type === 'action') {
            el.onclick = (e) => { e.preventDefault(); item.fx(); };
        }
        // No 'else' needed: standard links remain clean with onclick = null
    });
}

/**
 * Main function to handle the fade transition and state switching.
 */
function renderNav(stateKey) {
    const stateData = navStates[stateKey];
    const navContainers = document.querySelectorAll('.nav-item');

    const targets = document.querySelectorAll('.nav-item, .center-icon');
    targets.forEach(el => el.classList.add('faded'));

    setTimeout(() => {
        applyNavState(stateData);
        targets.forEach(el => el.classList.remove('faded'));
    }, 500);
}

function showAbout() {
    toggleAbout(true);
}

function toggleAbout(show) {
    const overlay = document.getElementById('about-overlay');
    if (show) {
        overlay.classList.add('visible');
        updateStory('lang-en'); 
    } else {
        overlay.classList.remove('visible');
    }
}

