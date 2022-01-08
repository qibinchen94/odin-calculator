const maxLength = 8; // Decimal point & negative sign not included
const symbols = {
	plus: '\u002B',
	minus: '\u2212',
    times: '\u00D7',
	divide: '\u00F7',
};

let firstNumber = '0';
let secondNumber = '';
let operator = '';
let result = '';

const topScreen = document.querySelector('.screens > .top');
const bottomScreen = document.querySelector('.screens > .bottom');
const numberButtons = Array.from(document.querySelectorAll('.btn.number'));
const operatorButtons = Array.from(document.querySelectorAll('.btn.operator'));
const equalBtn = document.querySelector('#equal-btn');
const clearBtn = document.querySelector('#clear-btn');
const deleteBtn = document.querySelector('#delete-btn');

numberButtons.forEach(btn => btn.addEventListener('click', pressNumber));
operatorButtons.forEach(btn => btn.addEventListener('click', pressOperator));
equalBtn.addEventListener('click', pressEqual);
clearBtn.addEventListener('click', pressClear);
deleteBtn.addEventListener('click', pressDelete);

function roundResult(numStr) {
	// if(+numStr >= 1e21 || +numStr < 1e-6)
	// 	console.log('Automatically using scientific notation');

	console.log(numStr);
	numberValue = +numStr;
	
	if (Math.abs(+numStr >= 1e8) || Math.abs(+numStr < 1e-6)) {
		numStr = numberValue.toExponential(4);
		console.log(numStr);
		const ePosition = numStr.indexOf('e');
		const significand = numStr.slice(0, ePosition);
		const exponent = numStr.slice(ePosition + 1);
		if (exponent >= 10) {
			alert('Oops! |Result| is too large (>=1e10)!');
			pressClear();
			return 'Too large';
		} else if(exponent <= -10) {
			alert('Oops! |Result| is too small (<=1e-10)!')
			pressClear();
			return 'Too small';
		}
		return +significand + 'e' + exponent;
	} else {
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
		const fractionLengthAvailable = maxLength - integerLength;
		return fractionLength > fractionLengthAvailable ?
				(+numberValue.toFixed(fractionLengthAvailable)) :
				numStr;
	}
}

function addDigit(numStr, digit) {
	if(numStr.length - 
		(numStr.includes('.') ? 1 : 0) - 
		(numStr.includes('-') ? 1 : 0) < 
		maxLength) {
		if (numStr === '0' || !numStr) {
			if(digit === '.') 
				numStr = '0.';
			else 
				numStr = digit;
		} else {
			if(!numStr.includes('.') || digit !== '.') 
				numStr += digit;
		}
		const test = 'Ha';
	}
	return numStr;
}

function pressNumber(event) {
	const digit = event.target.textContent;
	if (operator) {
		// If an operator already exists, wait for the 2nd number to be completed
		secondNumber = addDigit(secondNumber, digit);
		topScreen.textContent = firstNumber + operator;
		bottomScreen.textContent = secondNumber;
	} else {
		// If an operator doesn't exists, wait for the 1st number to be complete
		
		// After pressing equal button, result is stored in firstNumber. 
		// No operator means user is inputting a new number, thus firstNumber
		// needs to be reset.
		if(result) {
			firstNumber = '';
			result = '';
		}
		
		firstNumber = addDigit(firstNumber, digit);
		topScreen.textContent = '';
		bottomScreen.textContent = firstNumber;
	}
}

function pressOperator(event) {
	const eventOperator = event.target.textContent;
	operator = eventOperator;
	if (secondNumber) {
		calculate();

		firstNumber = result;
		secondNumber = '';
	}
	topScreen.textContent = firstNumber + operator;
	bottomScreen.textContent = '';
}

function pressEqual() {
	if (secondNumber) {
		calculate();
		if(result === 'Error') {
			alert('You cannot divided by 0');
			pressClear();
			return;
		}
		if (result !== 'Too large' && result !== 'Too small') {
			topScreen.textContent = firstNumber + operator + secondNumber + '=';
			bottomScreen.textContent = result;
			firstNumber = result;
			secondNumber = '';
			operator = '';
		}
	}
}

function pressClear() {
	firstNumber = '0';
	secondNumber = '';
	operator = '';
	result = '';
	topScreen.textContent = '';
	bottomScreen.textContent = '0';
}

function pressDelete() {
	if (result) return;
	if (secondNumber) {
		secondNumber = secondNumber.slice(0, -1);
		bottomScreen.textContent = secondNumber;
		topScreen.textContent = firstNumber + operator;
	} else if(operator) {
		operator = '';
		topScreen.textContent = '';
		bottomScreen.textContent = firstNumber;
	} else {
		if(firstNumber.length <= 1) {
			firstNumber = '0';
		} else {
			firstNumber = firstNumber.slice(0, -1);
		}
		bottomScreen.textContent = firstNumber;
	} 
}

function add(a, b) {
	return +a + +b;
};

function subtract(a, b) {
	return +a - +b;
};

function multiply(a, b) {
	return +a * +b;
};

function divide(a, b) {
	return +b === 0 ? 'Error' : +a / +b;
};

function calculate() {
	switch (operator) {
		case symbols.plus:
			result = add(firstNumber, secondNumber).toString();
			break;
		case symbols.minus:
			result = subtract(firstNumber, secondNumber).toString();
			break;
		case symbols.times:
			result = multiply(firstNumber, secondNumber).toString();
			break;
		case symbols.divide:
			result = divide(firstNumber, secondNumber).toString();
			break;
	}
	if (result === 'Error') return;
	result = roundResult(result);
}