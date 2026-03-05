const btnAi = document.getElementById('button-ai');
const btnPhone = document.getElementById('button-phone');
const inputLabel = document.getElementById('input-label');
const mainInput = document.getElementById('main-input');
const analyzeBtn = document.getElementById('analyze-btn');
const clearBtn = document.getElementById('clear-btn');
const resultValue = document.getElementById('result-value');
const resultUnit = document.getElementById('result-unit');
const resultEquivalent = document.getElementById('result-equivalent');
const liquid = document.getElementById('liquid');
const tankPct = document.getElementById('tank-pct');
let mode = 'ai';
let lastResult = 0;
const AI_WATER_PER_INTERACTION = 0.6;
const PHONE_WATER_PER_HOUR = 0.1;
const BOTTLE_SIZE = 0.5;
const GLASS_SIZE = 0.25;
const SHOWER_LITERS = 60;
const COFFEE_LITERS = 0.2;
btnAi.addEventListener('click', () => {
    mode = 'ai';
    btnAi.classList.add('active');
    btnPhone.classList.remove('active');
    inputLabel.textContent = 'Number of AI interactions today:';
    mainInput.placeholder = 'e.g. 10';
    mainInput.max = 1000;
    reset();
});
btnPhone.addEventListener('click', () => {
    mode = 'phone';
    btnPhone.classList.add('active');
    btnAi.classList.remove('active');
    inputLabel.textContent = 'Hours spent on phone today:';
    mainInput.placeholder = 'e.g. 4';
    mainInput.max = 24;
    reset();
});
analyzeBtn.addEventListener('click', () => {
    const value = parseFloat(mainInput.value);
    if (isNaN(value) || value < 0) {
        showError('⚠️ Please enter a valid positive number.');
        return;
    }
    if (mode === 'phone' && value > 24) {
        showError('⚠️ There are only 24 hours in a day!');
        return;
    }
    if (mode === 'ai' && value > 1000) {
        showError('⚠️ Please enter a realistic number of interactions.');
        return;
    }
    const liters = calculateWater(mode, value);
    lastResult = liters;
    displayResult(liters);
    animateTank(liters);
});
function calculateWater(currentMode, value) {
    if (currentMode === 'ai') {
        return value * AI_WATER_PER_INTERACTION;
    } else {
        return value * PHONE_WATER_PER_HOUR;
    }
}
function displayResult(liters) {
    const bottles = (liters / BOTTLE_SIZE).toFixed(1);
    const glasses = (liters / GLASS_SIZE).toFixed(1);
    const showerPercent = ((liters / SHOWER_LITERS) * 100).toFixed(1);
    const coffees = (liters / COFFEE_LITERS).toFixed(1);
    resultValue.textContent = liters.toFixed(2);
    resultUnit.textContent = 'liters / day';
    const level = getImpactLevel(liters);
    resultEquivalent.innerHTML =
        `${level.emoji} <strong>${level.label}</strong><br>` +
        `≈ ${bottles} bottles (500ml) or ${glasses} glasses of water<br>` +
        `That's ${showerPercent}% of a shower or ${coffees} cups of coffee worth of water.`;
}
function getImpactLevel(liters) {
 if (liters < 1) {
        return { emoji: '🟢', label: 'Low impact — Great job!' };
    } else if (liters < 5) {
        return { emoji: '🟡', label: 'Moderate impact — Room to improve.' };
    } else if (liters < 15) {
        return { emoji: '🟠', label: 'High impact — Consider reducing usage.' };
    } else {
        return { emoji: '🔴', label: 'Very high impact — Try to cut back significantly.' };
    }
}
function animateTank(liters) {
    const pct = Math.min(liters * 10, 100);
    liquid.style.height = pct + '%';
    tankPct.textContent = Math.round(pct) + '%';
    if (pct >= 80) {
        liquid.style.background = 'linear-gradient(to top, #ff4d6d, #ff8fa3)';
    } else if (pct >= 50) {
        liquid.style.background = 'linear-gradient(to top, #f4a100, #ffd166)';
    } else {
        liquid.style.background = 'linear-gradient(to top, #0a84ff, #00c4ff)';
    }
}
function showError(message) {
    resultEquivalent.textContent = message;
    resultEquivalent.style.borderLeftColor = '#ff4d6d';
    resultEquivalent.style.background = 'rgba(255, 77, 109, 0.06)';
    setTimeout(() => {
        resultEquivalent.style.borderLeftColor = '#0a84ff';
        resultEquivalent.style.background = 'rgba(10, 132, 255, 0.06)';
    }, 2500);
}
mainInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        analyzeBtn.click();
    }
});
mainInput.addEventListener('input', () => {
    if (mainInput.value === '' || mainInput.value < 0) {
        reset();
    }
});
clearBtn.addEventListener('click', reset);
function reset() {
    mainInput.value = '';
    lastResult = 0;
    resultValue.textContent = '—';
    resultUnit.textContent = 'liters / day';
    resultEquivalent.textContent = 'Enter a value above and click Analyze.';
    resultEquivalent.style.borderLeftColor = '#0a84ff';
    resultEquivalent.style.background = 'rgba(10, 132, 255, 0.06)';
    liquid.style.height = '0%';
    liquid.style.background = 'linear-gradient(to top, #0a84ff, #00c4ff)';
    tankPct.textContent = '0%';
}