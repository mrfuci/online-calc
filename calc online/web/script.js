function clearDisplay() {
    document.getElementById('display').value = '';
}

function clearEntry() {
    let display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

function deleteLast() {
    let display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

function calculate() {
    try {
        let result = eval(document.getElementById('display').value);
        document.getElementById('display').value = result;
    } catch (error) {
        alert('Neplatný výraz');
    }
}

function square() {
    let display = document.getElementById('display');
    let value = parseFloat(display.value);
    display.value = value ** 2;
}

function squareRoot() {
    let display = document.getElementById('display');
    let value = parseFloat(display.value);
    if (value < 0) {
        alert('Nelze počítat odmocninu záporného čísla');
    } else {
        display.value = Math.sqrt(value);
    }
}

function calculateReciprocal() {
    let display = document.getElementById('display');
    let value = parseFloat(display.value);
    if (value === 0) {
        alert('Nelze dělit nulou');
    } else {
        display.value = 1 / value;
    }
}

function toggleSign() {
    let display = document.getElementById('display');
    let value = parseFloat(display.value);
    display.value = value * -1;
}

document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
