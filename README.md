# odin-calculator

This is the [calculator project](https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/calculator) from the Odin Project.

[Live Preview](https://qibinchen94.github.io/odin-calculator/)

## Features

- [x] Rounding errors fixed (0.1 + 0.2 = 0.3 instead of 0.300...004)
- [x] Error message when divided by 0
- [x] Keyboard support
- [x] Display scientific notation if absolute value of a non-zero number is larger than 10<sup>8</sup> or smaller than 10<sup>-8</sup>. Changeable according to maximum number of digits to display.
- [x] Given a fixed length of the screens, change font size according to input
- [ ] User can choose a maximum number of digits to display (8 by default)
- [ ] Make a function to parse the expression

## TO DO

- [x] Fix floating point rounding error
- [x] Round answers if too many digit
- [x] Better UI
- [ ] Simplify codes

## Notes

- When the absolute value of a non-zero number is larger or equal than 1e21 (>=1e21), or smaller than 1e-6 (<1e-6), number.toString() returns the exponential notation.
