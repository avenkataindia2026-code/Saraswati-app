/**
 * ripple.js - The Performance-Optimized Ripple Engine
 */
const RIPPLE_CONFIG = {
    STEP: 3,
    FRICTION: 0.97,
    VELOCITY: 5.0,
    INITIAL_AMP: 100,
    MAX_RADIUS: 1800,
    MIN_AMPLITUDE: 1.0,
    WAVE_LENGTH: 0.15,
    FADE_EXPONENT: 2.0
};

let canvas, ctx, img, referenceData;
let ripples = [];

function initRippleEngine() {
    canvas = document.getElementById('rippleCanvas');
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    img = new Image();
    img.src = 'img/saraswati-bg.webp';
    img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(img, 0, 0);
        referenceData = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;
        
        requestAnimationFrame(renderLoop);
    };
}

function triggerRipple(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    ripples.push({
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
        progress: 0,
        amplitude: RIPPLE_CONFIG.INITIAL_AMP
    });
    
    new Audio('audio/519991__casstway__waterdrop.mp3').play().catch(() => {});
}

function renderLoop() {
    ctx.drawImage(img, 0, 0);
    if (ripples.length > 0) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;
        const s = RIPPLE_CONFIG.STEP;

        for (let y = 0; y < canvas.height - s; y += s) {
            for (let x = 0; x < canvas.width - s; x += s) {
                let dX = 0, dY = 0, active = false;
                for (let r of ripples) {
                    const dx = x - r.x, dy = y - r.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const diff = dist - r.progress;
                    if (diff > -250 && diff < 0) {
                        active = true;
                        const trailingFade = Math.pow(1 + diff / 250, RIPPLE_CONFIG.FADE_EXPONENT);
                        const force = (Math.sin(diff * RIPPLE_CONFIG.WAVE_LENGTH) * r.amplitude * trailingFade * (1 - dist / RIPPLE_CONFIG.MAX_RADIUS)) / (dist || 1);
                        dX += dx * force; dY += dy * force;
                    }
                }
                if (active) {
                    const tx = Math.floor(x + dX), ty = Math.floor(y + dY);
                    if (tx >= 0 && tx < canvas.width && ty >= 0 && ty < canvas.height) {
                        const sIdx = (ty * canvas.width + tx) * 4;
                        for (let ky = 0; ky < s; ky++) {
                            for (let kx = 0; kx < s; kx++) {
                                const dIdx = ((y + ky) * canvas.width + (x + kx)) * 4;
                                pixels[dIdx] = referenceData[sIdx];
                                pixels[dIdx+1] = referenceData[sIdx+1];
                                pixels[dIdx+2] = referenceData[sIdx+2];
                                pixels[dIdx+3] = 255;
                            }
                        }
                    }
                }
            }
        }
        ctx.putImageData(imgData, 0, 0);
        updateRipplePhysics();
    }
    requestAnimationFrame(renderLoop);
}

function updateRipplePhysics() {
    for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].progress += RIPPLE_CONFIG.VELOCITY;
        ripples[i].amplitude *= RIPPLE_CONFIG.FRICTION;
        if (ripples[i].amplitude < RIPPLE_CONFIG.MIN_AMPLITUDE || ripples[i].progress > RIPPLE_CONFIG.MAX_RADIUS) {
            ripples.splice(i, 1);
        }
    }
}

// Global exposure
window.triggerRipple = triggerRipple;
window.initRippleEngine = initRippleEngine;
