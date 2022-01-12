function clear() {
	currentOperand = '';
	previousOperand = '';
	currentOperandDigits = 0;
	previousOperandDigits = 0;
	operator = '';
	result = '';
	topScreen.textContent = '';
	bottomScreen.textContent = '0';
}

function backspace() {
	if (result) return;
	if (operator && !currentOperand) {
		operator = '';
		currentOperand = previousOperand;
		previousOperand = '';
		currentOperandDigits = previousOperandDigits;
		previousOperandDigits = 0;
	} else {
		currentOperand = currentOperand.slice(0, -1);
		currentOperandDigits--;
		if(currentOperandDigits < 0) currentOperandDigits = 0;
	}

	topScreen.textContent = previousOperand + operator;
	if(!previousOperand && !currentOperand) {
		bottomScreen.textContent = '0';
		return;
	}
	bottomScreen.textContent = currentOperand;
}

function appendNumber(event) {
	const digit = event.target.textContent;
	if (currentOperandDigits >= maxDigits) return;
	if (currentOperand.includes('.') && digit === '.') return;
	if (currentOperand === '0' || !currentOperand) {
		if(digit === '.') {
			currentOperand = '0.';
		} else {
			currentOperand = digit;
		}
	} else {
		currentOperand += digit;
	}
	currentOperandDigits++;
	topScreen.textContent = previousOperand + operator;
	bottomScreen.textContent = currentOperand;
	resizeToFit();
}

function addOperator(event) {
	if (previousOperand && currentOperand) {
		calculate();
		if(!result) return;
		previousOperand = result;
	} else {
		if (result && !currentOperand) {
			currentOperand = result;
			result = '';
		}
		if (!operator) {
			previousOperand = currentOperand;
			currentOperand = '';
			previousOperandDigits = currentOperandDigits;
			currentOperandDigits = 0;
		}
	}
	operator = event.target.textContent;
	topScreen.textContent = previousOperand + operator;
	bottomScreen.textContent = currentOperand;
}

function calculate() {
	const previousNumber = +previousOperand;
	const currentNumber = +currentOperand;
	switch (operator) {
		case symbols.plus:
			result = (previousNumber + currentNumber).toString();
			break;
		case symbols.minus:
			result = (previousNumber - currentNumber).toString();
			break;
		case symbols.times:
			result = (previousNumber * currentNumber).toString();
			break;
		case symbols.divide:
			result = currentNumber === 0 ? 'Error' : (previousNumber / currentNumber).toString();
			break;
	}
	if (result === 'Error') {
		alert('You cannot divided by 0');
		result = '';
		return;
	} 
	if (Math.abs(+result) >= 1e10) {
		alert('Oops! |Result| is too large (>=1e10)!');
		result = '';
		return;
	}
	if (Math.abs(+result) <= 1e-10 && Math.abs(+result) !== 0) {
		alert('Oops! |Result| is too small (<=1e-10)!');
		result = '';
		return;
	}
	result = roundResult(result);
	topScreen.textContent = previousOperand + operator + currentOperand + '=';
	bottomScreen.textContent = result;
	resizeToFit();
	previousOperand = '';
	currentOperand = '';
	previousOperandDigits = 0;
	currentOperandDigits = 0;		
	operator = '';
}

function roundResult(numStr) {
	console.log(numStr);
	numberValue = +numStr;
	
	if (Math.abs(+numStr) >= 1e8 || (Math.abs(+numStr) < 1e-6 && Math.abs(+numStr) !== 0)) {
		console.log('Scientific notation');
		numStr = numberValue.toExponential(4);
		console.log(numStr);
		const ePosition = numStr.indexOf('e');
		const significand = numStr.slice(0, ePosition);
		const exponent = numStr.slice(ePosition + 1);
		return +significand + 'e' + exponent;
	} else {
		console.log('Fixed notation');
		const decimalIndex = numStr.indexOf('.');
		let integerLength;
		let fractionLength;
		if (decimalIndex !== -1) {
			integerLength = decimalIndex - (numStr.includes('-') ? 1 : 0);
			fractionLength = numStr.length - decimalIndex - 1;
		} else {
			integerLength = numStr.length - (numStr.includes('-') ? 1 : 0);
			fractionLength = 0;
		}
		const fractionLengthAvailable = maxDigits - integerLength;
		return fractionLength > fractionLengthAvailable ?
				(+numberValue.toFixed(fractionLengthAvailable)) :
				numStr;
	}
}

function resizeToFit() {
	const screenWidth = topScreen.clientWidth;
	if (screenWidth > maxScreenWidth) {
		const fontSize = parseFloat(window.getComputedStyle(topScreen).fontSize);
		topScreen.style.fontSize = fontSize - 8 + 'px';
		resizeToFit();
	}
}

function keydown(event) {
	console.log(event);
	// console.log(event.shiftKey);
	const clickEvent = new Event('click');
	console.log(event.keyCode);
	const keyCode = event.keyCode;
	console.log(keyCode);
	let button;
	if (event.shiftKey) {
		switch (keyCode) {
			case 56:
				button = document.querySelector('[data-keycode="106"]'); // Shift + '8' = '*'
				break;
			case 187:
				button = document.querySelector('[data-keycode="107"]'); // Shift + '+' = '='
				break;
		}
	} else {
		if (keyCode === 13) {
			button = document.querySelector(`[data-keycode="187"]`); // Enter
		} else if (keyCode === 111) {
			button = document.querySelector(`[data-keycode="191"]`); // Number pad ÷
		} else if (keyCode === 109) {
			button = document.querySelector(`[data-keycode="189"]`); // Number pad -
		} else if (keyCode === 110) {
			button = document.querySelector(`[data-keycode="190"]`); // Number pad .
		} else if (keyCode === 108) {
			button = document.querySelector(`[data-keycode="190"]`); // Number pad . (Firefox)
		} else if (96 <= keyCode && keyCode <= 105) {
			button = document.querySelector(`[data-keycode="${event.keyCode - 48}"]`); // Number pad numbers
		} else {
			button = document.querySelector(`[data-keycode="${event.keyCode}"]`);
		}
	}

	console.log(button);
	if(!button) return;
	button.dispatchEvent(clickEvent);
}

let currentOperand = '';
let previousOperand = '';
let operator = '';
let result = '';
const maxDigits = 8; // Maximum digits
let currentOperandDigits = 0;
let previousOperandDigits = 0;
const symbols = {
	plus: '\u002B',
	minus: '\u2212',
    times: '\u00D7',
	divide: '\u00F7',
};
const topScreen = document.querySelector('.screens > .top');
const bottomScreen = document.querySelector('.screens > .bottom');
const numberButtons = Array.from(document.querySelectorAll('.btn.number'));
const operatorButtons = Array.from(document.querySelectorAll('.btn.operator'));
const equalBtn = document.querySelector('#equal-btn');
const clearBtn = document.querySelector('#clear-btn');
const deleteBtn = document.querySelector('#delete-btn');
const maxScreenWidth = document.querySelector('.screens').clientWidth;

numberButtons.forEach(btn => btn.addEventListener('click', appendNumber));
operatorButtons.forEach(btn => btn.addEventListener('click', addOperator));
equalBtn.addEventListener('click', calculate);
clearBtn.addEventListener('click', clear);
deleteBtn.addEventListener('click', backspace);
window.addEventListener('keydown', keydown);