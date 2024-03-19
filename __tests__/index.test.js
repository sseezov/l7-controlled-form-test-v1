/* eslint-disable */
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import testingLibrary, { configure } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import nock from 'nock';
import run, { validateEmail, validateName } from '../src/application.js';

const { screen, waitFor } = testingLibrary;

let elements;

beforeEach(() => {
  const pathToFixture = path.join('__tests__', '__fixtures__', 'index.html');
  const initHtml = fs.readFileSync(pathToFixture).toString();
  document.body.innerHTML = initHtml;
  run();

  elements = {
    submit: screen.getByText(/Submit/),
    nameInput: screen.getByRole('textbox', { name: /Name/ }),
    emailInput: screen.getByRole('textbox', { name: /Email/ }),
    // passwordInput: screen.getByLabelText(/Password/, { selector: '[name="password"]' }),
    // passwordConfirmationInput: screen.getByLabelText(/Password Confirmation/),
  };
});

test('step1', async () => {
  expect(validateName('example@gmail.com')).toEqual([]);
  expect(validateName('')).toEqual(['name cannot be empty']);
  expect(validateName(' ')).toEqual(['name cannot be empty']);
  expect(validateName('e')).toEqual([]);
});

test('step2', async () => {
  expect(validateEmail('example@gmail.com')).toEqual([]);
  expect(validateEmail(' @mail.com')).toEqual(['invalid email']);
  expect(validateEmail('hhhhh @ g m a i l . c o m')).toEqual(['invalid email']);
  expect(validateEmail('s@s')).toEqual([]);
});

test('step3', async () => {
  await userEvent.type(elements.nameInput, 'Petya');
  await userEvent.type(elements.emailInput, 'wrong-email');
  expect(elements.submit).toBeDisabled();

  await userEvent.clear(elements.nameInput);
  await userEvent.clear(elements.emailInput);
  await userEvent.type(elements.nameInput, ' ');
  await userEvent.type(elements.emailInput, 'email@right');
  expect(elements.submit).toBeDisabled();

  await userEvent.clear(elements.nameInput);
  await userEvent.clear(elements.emailInput);
  await userEvent.type(elements.nameInput, 'Petya');
  await userEvent.type(elements.emailInput, 'w@s');
  expect(elements.submit).not.toBeDisabled();
});

test('step4', async () => {
  await userEvent.clear(elements.nameInput);
  await userEvent.clear(elements.emailInput);
  await userEvent.type(elements.nameInput, 'Petya');
  await userEvent.type(elements.emailInput, 'wrong-email');
  expect(elements.nameInput).toHaveClass('is-valid');
  expect(elements.emailInput).toHaveClass('is-invalid');
  expect(elements.nameInput).not.toHaveClass('is-invalid');
  expect(elements.emailInput).not.toHaveClass('is-valid');

  await userEvent.clear(elements.nameInput);
  await userEvent.clear(elements.emailInput);
  await userEvent.type(elements.nameInput, '  ');
  await userEvent.type(elements.emailInput, 'email@s');
  expect(elements.nameInput).toHaveClass('is-invalid');
  expect(elements.emailInput).toHaveClass('is-valid');

  await userEvent.clear(elements.nameInput);
  await userEvent.type(elements.nameInput, 's  ');
  expect(elements.nameInput).toHaveClass('is-valid');
});
