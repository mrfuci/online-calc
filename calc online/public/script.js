// Funkce pro zaznamenání kliknutí na tlačítko
function logButtonClick(button) {
    fetch('/log-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ button: button })
    }).catch(error => console.error('Chyba při odesílání kliknutí:', error));
}

// Funkce pro aktualizaci displeje kalkulačky
function appendToDisplay(value) {
    logButtonClick(value); // Zaznamenání kliknutí na tlačítko
    const display = document.getElementById('display');
    const currentValue = display.value;
    const lastChar = currentValue.slice(-1);

    if (['+', '-', '*', '/'].includes(value)) {
        if (['+', '-', '*', '/'].includes(lastChar)) {
            return; // Zamezení více operátorů za sebou
        }
    }

    if (value === '.') {
        const lastNumber = currentValue.split(/[\+\-\*\/]/).pop();
        if (lastNumber.includes('.')) {
            return; // Zamezení více desetinných teček
        }
    }

    display.value += value;
}

// Výpočet výsledku
function calculate() {
    logButtonClick('=');

    try {
        const display = document.getElementById('display');
        let expression = display.value;

        // Zpracování procent
        if (expression.includes('%')) {
            expression = expression.replace(/(\d+(\.\d+)?)([%])/g, (match, num) => {
                // Převod procent na hodnotu
                const base = eval(expression.split(/[\+\-\*\/]/).slice(0, -1).join('')); // Hodnota před %
                return (parseFloat(num) / 100) * base;
            });
        }

        let result = eval(expression); // Vyhodnocení opraveného výrazu
        display.value = result;
    } catch (error) {
        alert('Neplatný výraz');
    }
}


// Speciální operace
function clearDisplay() {
    document.getElementById('display').value = '';
    logButtonClick('C');
}

function clearEntry() {
    const display = document.getElementById('display');
    const currentValue = display.value;

    // Pokud má displej hodnotu, odstraní poslední znak
    if (currentValue.length > 0) {
        display.value = currentValue.slice(0, -1);
    }

    logButtonClick('CE');
}

function deleteLast() {
    const display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
    logButtonClick('⌫');
}

function square() {
    logButtonClick('x²');
    const display = document.getElementById('display');
    const value = parseFloat(display.value);
    display.value = value ** 2;
}

function squareRoot() {
    logButtonClick('²√x');
    const display = document.getElementById('display');
    const value = parseFloat(display.value);
    if (value < 0) {
        alert('Nelze počítat odmocninu záporného čísla');
    } else {
        display.value = Math.sqrt(value);
    }
}

function toggleSign() {
    logButtonClick('+/-');
    const display = document.getElementById('display');
    const value = parseFloat(display.value);
    display.value = value * -1;
}

// Přepínání módů
function toggleMode(mode, className) {
    logButtonClick(mode);
    document.body.classList.toggle(className);
}

// Event listenery pro módová tlačítka
document.getElementById('dark-mode-toggle').addEventListener('click', () => toggleMode('Dark Mode', 'dark-mode'));
document.getElementById('banan-mode-toggle').addEventListener('click', () => toggleMode('Banan Mode', 'banan-mode'));
document.getElementById('strawb-mode-toggle').addEventListener('click', () => toggleMode('Strawb Mode', 'strawb-mode'));
document.getElementById('avocad-mode-toggle').addEventListener('click', () => toggleMode('Avocad Mode', 'avocad-mode'));

// Připojení k Socket.IO
const socket = io();

// Funkce pro aktualizaci statistik
function updateStats(data) {
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = ''; // Vyprázdnění předchozích statistik

    for (const [button, clicks] of Object.entries(data)) {
        const stat = document.createElement('div');
        stat.className = 'stat';
        stat.innerHTML = `<span>${button}</span><span>${clicks}</span>`;
        statsContainer.appendChild(stat);
    }
}

// Načítání statistik při načtení
fetch('/stats')
    .then(response => response.json())
    .then(updateStats)
    .catch(error => console.error('Chyba při načítání statistik:', error));

// Live aktualizace statistik přes WebSocket
socket.on('stats-update', updateStats);
