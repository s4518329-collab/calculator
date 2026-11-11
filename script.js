/* ==========================================================================
   SCRIPT: ARITHMETIC ENGINE - BLACK & ORANGE CALCULATOR
   ========================================================================== */

/**
 * Calculator State Container
 */
const state = {
  currentOperand: '0',
  previousOperand: '',
  operation: null,
  shouldResetScreen: false
};

/**
 * DOM Element References
 */
const elements = {
  displayCurrent: document.getElementById('currentOperand'),
  displayHistory: document.getElementById('previousOperand'),
  keypad: document.querySelector('.keypad-grid')
};

/**
 * Formats a raw number string with standard US comma grouping while typing.
 * e.g., "1234567.8" -> "1,234,567.8"
 */
function formatNumber(valueStr) {
  if (valueStr === 'Error' || valueStr === '') return valueStr;

  const parts = valueStr.split('.');
  const intPart = parseFloat(parts[0]);
  const decimalPart = parts[1];

  let formattedInt = '';
  if (isNaN(intPart)) {
    formattedInt = valueStr.startsWith('-') ? '-' : '';
  } else {
    formattedInt = intPart.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  return decimalPart !== undefined ? `${formattedInt}.${decimalPart}` : formattedInt;
}

/**
 * Returns user-facing mathematical symbols for internal operators.
 */
function getSymbol(op) {
  switch (op) {
    case '+': return '+';
    case '-': return '−';
    case '*': return '×';
    case '/': return '÷';
    default: return '';
  }
}

/**
 * Synchronizes internal state with the visual screen.
 */
function updateDisplay() {
  elements.displayCurrent.textContent = formatNumber(state.currentOperand);

  if (state.operation != null) {
    elements.displayHistory.textContent = `${formatNumber(state.previousOperand)} ${getSymbol(state.operation)}`;
  } else {
    elements.displayHistory.textContent = '';
  }
}

/**
 * Appends a numeric digit (0-9) to current operand.
 */
function appendNumber(num) {
  if (state.shouldResetScreen || state.currentOperand === 'Error') {
    state.currentOperand = '';
    state.shouldResetScreen = false;
  }

  // Prevent multiple leading zeros
  if (state.currentOperand === '0' && num === '0') return;

  // Replace lone initial zero
  if (state.currentOperand === '0' && num !== '.') {
    state.currentOperand = num;
    return;
  }

  // Prevent display overflow (max 12 numeric digits)
  if (state.currentOperand.replace(/[^0-9]/g, '').length >= 12) return;

  state.currentOperand += num;
}

/**
 * Appends a decimal point safely without duplication.
 */
function appendDecimal() {
  if (state.shouldResetScreen || state.currentOperand === 'Error') {
    state.currentOperand = '0';
    state.shouldResetScreen = false;
  }

  if (state.currentOperand.includes('.')) return;
  state.currentOperand += '.';
}

/**
 * Handles operator selection (+, -, *, /) and chained calculations.
 */
function chooseOperation(op) {
  if (state.currentOperand === 'Error') return;

  // Compute pending calculation if one exists
  if (state.previousOperand !== '' && !state.shouldResetScreen) {
    calculate();
  }

  state.operation = op;
  state.previousOperand = state.currentOperand;
  state.shouldResetScreen = true;
}

/**
 * Performs arithmetic calculation with precision handling.
 */
function calculate() {
  if (state.operation == null || state.previousOperand === '' || state.shouldResetScreen) {
    return;
  }

  const prev = parseFloat(state.previousOperand);
  const current = parseFloat(state.currentOperand);

  if (isNaN(prev) || isNaN(current)) return;

  let result;
  switch (state.operation) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      if (current === 0) {
        state.currentOperand = 'Error';
        state.previousOperand = '';
        state.operation = null;
        state.shouldResetScreen = true;
        return;
      }
      result = prev / current;
      break;
    default:
      return;
  }

  // Precision rounding to avoid binary floating-point rounding quirks (e.g., 0.1 + 0.2)
  state.currentOperand = (Math.round(result * 1e10) / 1e10).toString();
  state.operation = null;
  state.previousOperand = '';
  state.shouldResetScreen = true;
}

/**
 * Resets the calculator (All Clear).
 */
function clearAll() {
  state.currentOperand = '0';
  state.previousOperand = '';
  state.operation = null;
  state.shouldResetScreen = false;
}

/**
 * Toggles positive and negative sign.
 */
function toggleSign() {
  if (state.currentOperand === '0' || state.currentOperand === 'Error') return;

  if (state.currentOperand.startsWith('-')) {
    state.currentOperand = state.currentOperand.slice(1);
  } else {
    state.currentOperand = '-' + state.currentOperand;
  }
}

/**
 * Calculates percentage (divides current operand by 100).
 */
function computePercentage() {
  if (state.currentOperand === '0' || state.currentOperand === 'Error') return;

  const val = parseFloat(state.currentOperand);
  state.currentOperand = (val / 100).toString();
}

/**
 * Deletes the last entered character (Backspace).
 */
function deleteLast() {
  if (state.shouldResetScreen || state.currentOperand === 'Error') {
    state.currentOperand = '0';
    return;
  }

  if (state.currentOperand.length > 1) {
    state.currentOperand = state.currentOperand.slice(0, -1);
    // If only '-' remains, reset to '0'
    if (state.currentOperand === '-') state.currentOperand = '0';
  } else {
    state.currentOperand = '0';
  }
}

/**
 * Event Delegation for Keypad Clicks
 */
elements.keypad.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const { number, operator, action } = btn.dataset;

  if (number !== undefined) {
    appendNumber(number);
    updateDisplay();
    return;
  }

  if (operator !== undefined) {
    chooseOperation(operator);
    updateDisplay();
    return;
  }

  if (action !== undefined) {
    switch (action) {
      case 'clear':
        clearAll();
        break;
      case 'toggle-sign':
        toggleSign();
        break;
      case 'percent':
        computePercentage();
        break;
      case 'decimal':
        appendDecimal();
        break;
      case 'backspace':
        deleteLast();
        break;
      case 'calculate':
        calculate();
        break;
    }
    updateDisplay();
  }
});

/**
 * Keyboard Shortcut Bindings
 */
window.addEventListener('keydown', (e) => {
  const { key } = e;

  if (/^[0-9]$/.test(key)) {
    e.preventDefault();
    appendNumber(key);
    updateDisplay();
  } else if (key === '.') {
    e.preventDefault();
    appendDecimal();
    updateDisplay();
  } else if (['+', '-', '*', '/'].includes(key)) {
    e.preventDefault();
    chooseOperation(key);
    updateDisplay();
  } else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    calculate();
    updateDisplay();
  } else if (key === 'Backspace') {
    e.preventDefault();
    deleteLast();
    updateDisplay();
  } else if (key === 'Escape') {
    e.preventDefault();
    clearAll();
    updateDisplay();
  } else if (key === '%') {
    e.preventDefault();
    computePercentage();
    updateDisplay();
  }
});

// Initialize on page load
updateDisplay();
