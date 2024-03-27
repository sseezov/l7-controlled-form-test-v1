/* eslint-disable */
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import testingLibrary, { configure } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import nock from 'nock';
import run, { validateEmail, validateName } from '../src/application.js';

const { screen, waitFor } = testingLibrary;
nock.disableNetConnect();

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
  };
});

test('step1', async () => {
  const formContainer = document.querySelector('.form-container');
  expect(formContainer.querySelector('form')
    .querySelector('.form-group')
    .querySelector('input[class="form-control"]')).not.toEqual(null);
});

test('step2', async () => {
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

test('step3', async () => {
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


test('step4', async () => {
  let scope = nock('http://localhost')
    .post('/users')
    .reply(200, {
      message: 'user has been created sucessfully'
    });

  await userEvent.clear(elements.nameInput);
  await userEvent.clear(elements.emailInput);
  await userEvent.type(elements.nameInput, 'Petya');
  await userEvent.type(elements.emailInput, 'correct@email');

  await userEvent.click(elements.submit);
  await waitFor(() => {
    expect(document.body).not.toHaveClass('container')
    const p = document.querySelector('p');
    expect(p).toHaveTextContent('user has been created sucessfully')
  });

  // для сохранения количества тестов равного 5, мне пришлось снова проинициализировать приложение
  const pathToFixture = path.join('__tests__', '__fixtures__', 'index.html');
  const initHtml = fs.readFileSync(pathToFixture).toString();
  document.body.innerHTML = initHtml;
  run();

  elements = {
    submit: screen.getByText(/Submit/),
    nameInput: screen.getByRole('textbox', { name: /Name/ }),
    emailInput: screen.getByRole('textbox', { name: /Email/ }),
  };

  scope = nock('http://localhost')
    .post('/users')
    .reply(200, {
      message: 'there is no spoon'
    });

  await userEvent.clear(elements.nameInput);
  await userEvent.clear(elements.emailInput);
  await userEvent.type(elements.nameInput, 'Petya');
  await userEvent.type(elements.emailInput, 'correct@email');

  await userEvent.click(elements.submit);
  await waitFor(() => {
    const p = document.querySelector('p');
    expect(p).toHaveTextContent('there is no spoon')
  });

  scope.done();
});



