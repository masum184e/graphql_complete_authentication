import zxcvbn from 'zxcvbn';

const validatePassword = (password) => {
  const result = zxcvbn(password);
  const score = result.score;
  if (score < 3) {
    throw new Error("Enter a Strong Password");
  }
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Enter a Valid Email");
  }
}

const validateNumber = (number, length) => {
  const numberRegex = /^[0-9]+$/;
  if (!numberRegex.test(number) || number.length!=length) {
    throw new Error("Enter a Valid Number");
  }
}

const validateAlphabet = (input) => {
  const alphabetRegex = /^[A-Za-z]+$/;
  if (!alphabetRegex.test(input)) {
    throw new Error("Only Alphabet is allow");
  }
}

const validateAlphabetWithOneSpace = (input) => {
  const alphabetWithOneSpaceRegex = /^[A-Za-z]+(?: [A-Za-z]+)?$/;
  if (!alphabetWithOneSpaceRegex.test(input)) {
    throw new Error("Only Alphabet & Only Single Space is Allow");
  }
}

export { validatePassword, validateEmail, validateNumber, validateAlphabet, validateAlphabetWithOneSpace };