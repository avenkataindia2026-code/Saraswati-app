window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") ; // TODO replace with close page
});

window.addEventListener('load', () => {
    if (typeof initRippleEngine === 'function') initRippleEngine();
});

