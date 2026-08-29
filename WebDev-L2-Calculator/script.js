const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");

const clearButton = document.querySelector('[data-action="clear"]');
const backspaceButton = document.querySelector('[data-action="backspace"]');
const equalsButton = document.querySelector('[data-action="equals"]');


let currentValue = "";
let previousValue = "";
let operator = null;


// -----------------------------
// Update calculator display
// -----------------------------

function updateDisplay() {

    currentDisplay.textContent = currentValue || "0";

    if (previousValue && operator) {
        previousDisplay.textContent =
            `${previousValue} ${getOperatorSymbol(operator)}`;
    } else {
        previousDisplay.textContent = "";
    }
}


// -----------------------------
// Display operator symbols
// -----------------------------

function getOperatorSymbol(operator) {

    if (operator === "*") {
        return "×";
    }

    if (operator === "/") {
        return "÷";
    }

    if (operator === "-") {
        return "−";
    }

    return operator;
}


// -----------------------------
// Add number to display
// -----------------------------

function addNumber(number) {

    // Prevent multiple decimal points
    if (number === "." && currentValue.includes(".")) {
        return;
    }

    // Prevent multiple leading zeros
    if (currentValue === "0" && number !== ".") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}


// -----------------------------
// Select operator
// -----------------------------

function chooseOperator(selectedOperator) {

    if (currentValue === "" && previousValue === "") {
        return;
    }

    // Operator chaining
    if (currentValue !== "" && previousValue !== "" && operator) {
        calculate();
    }

    if (currentValue !== "") {
        previousValue = currentValue;
        currentValue = "";
    }

    operator = selectedOperator;

    updateDisplay();
}


// -----------------------------
// Perform calculation
// -----------------------------

function calculate() {

    if (previousValue === "" || currentValue === "" || !operator) {
        return;
    }

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

    let result;


    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":

            if (secondNumber === 0) {

                currentDisplay.textContent =
                    "Cannot divide by 0";

                previousDisplay.textContent = "";

                currentValue = "";
                previousValue = "";
                operator = null;

                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }


    // Avoid unnecessary decimal digits
    result = parseFloat(result.toFixed(10));

    currentValue = result.toString();

    previousValue = "";

    operator = null;

    updateDisplay();
}


// -----------------------------
// Clear calculator
// -----------------------------

function clearCalculator() {

    currentValue = "";

    previousValue = "";

    operator = null;

    updateDisplay();
}


// -----------------------------
// Backspace
// -----------------------------

function deleteLastCharacter() {

    currentValue = currentValue.slice(0, -1);

    updateDisplay();
}


// -----------------------------
// Number button events
// -----------------------------

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        addNumber(button.dataset.number);

    });

});


// -----------------------------
// Operator button events
// -----------------------------

operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        chooseOperator(button.dataset.operator);

    });

});


// -----------------------------
// Equals button
// -----------------------------

equalsButton.addEventListener("click", () => {

    calculate();

});


// -----------------------------
// Clear button
// -----------------------------

clearButton.addEventListener("click", () => {

    clearCalculator();

});


// -----------------------------
// Backspace button
// -----------------------------

backspaceButton.addEventListener("click", () => {

    deleteLastCharacter();

});


// Initial display
updateDisplay();