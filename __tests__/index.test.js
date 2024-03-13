/* eslint-disable */

import { test } from 'node:test';
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
  console.log(11111111111111111111111111111111, initHtml);
  document.body.innerHTML = initHtml;
  run();

  elements = {
    submit: screen.getByText(/Submit/),
    // nameInput: screen.getByRole('textbox', { name: /Name/ }),
    // emailInput: screen.getByRole('textbox', { name: /Email/ }),
    // passwordInput: screen.getByLabelText(/Password/, { selector: '[name="password"]' }),
    // passwordConfirmationInput: screen.getByLabelText(/Password Confirmation/),
  };
});

test('step1', async () => {
  expect(validateName('example@gmail.com')).toEqual({});
  expect(validateName('')).toEqual({ errors: ['имя не может быть пустым'] });
  expect(validateName(' ')).toEqual({ errors: ['имя не может быть пустым'] });
  expect(validateName('e')).toEqual({});
});

test('step2', async () => {
  expect(validateEmail('example@gmail.com')).toEqual({});
  expect(validateEmail(' @mail.com')).toEqual({ errors: ['невалидный email'] });
  expect(validateEmail('hhhhh @ g m a i l . c o m')).toEqual({ errors: ['невалидный email'] });
  expect(validateEmail('s@s')).toEqual({});
});

test('step3', async () => {
  expect(screen.getByRole('button', { selector: '[type="submit"]', options: { hidden: true } })).toBeDisabled();
});
