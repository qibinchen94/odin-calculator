const maxLength = 16;
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

function display (node, content) {
	node.textContent = content;
}

function pressNumber(event) {
	const digit = event.target.textContent;
	if (operator) {
		// If an operator already exists, wait for the 2nd number to be completed

		if (secondNumber === '0' || !secondNumber) {
			if(digit === '.') 
				secondNumber = '0.';
			else 
				secondNumber = digit;
		} else {
			if(!secondNumber.includes('.') || digit !== '.') 
				secondNumber += digit;
		}

		display(topScreen, firstNumber + operator);
		display(bottomScreen, secondNumber);
	} else {
		// If an operator doesn't exists, wait for the 1st number to be complete
		
		// After pressing equal button, result is stored in firstNumber. 
		// No operator means user is inputting a new number, thus firstNumber
		// needs to be reset.
		if(result) {
			firstNumber = '';
			result = '';
		}
		
		if (firstNumber === '0' || !firstNumber) {
			if(digit === '.') 
				firstNumber = '0.';
			else 
				firstNumber = digit;
		} else {
			if(!firstNumber.includes('.') || digit !== '.') 
				firstNumber += digit;
		}

		display(topScreen,'');
		display(bottomScreen, firstNumber);
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
	display(topScreen, firstNumber + operator);
	display(bottomScreen, '');
}


function pressEqual() {
	if (secondNumber) {
		calculate();
		display(topScreen, firstNumber + operator + secondNumber + '=');
		display(bottomScreen, result);
		firstNumber = result;
		secondNumber = '';
		operator = '';
	}
}

function pressClear() {
	firstNumber = '0';
	secondNumber = '';
	operator = '';
	result = '';
	display(topScreen, '');
	display(bottomScreen, '0');
}

function pressDelete() {
	if (result) return;
	if (secondNumber) {
		secondNumber = secondNumber.slice(0, -1);
		display(bottomScreen, secondNumber);
		display(topScreen, firstNumber + operator);
	} else if(operator) {
		operator = '';
		display(topScreen, '');
		display(bottomScreen, firstNumber);
	} else {
		if(firstNumber.length <= 1) {
			firstNumber = '0';
		} else {
			firstNumber = firstNumber.slice(0, -1);
		}
		display(bottomScreen, firstNumber);
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
}