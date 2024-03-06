import { test } from 'node:test';
import assert from 'assert/strict';
import { validateEmail, validatePassword } from '../src/index.js';

test('step1', () => {
  assert.equal(validateEmail('example@gmail.com'), 'Email валиден');
  assert.equal(validateEmail('example21312@gmail.com'), 'Email валиден');
  assert.equal(validateEmail('_____@gmail.com'), 'Email валиден');
});

test('step2', () => {
  assert.equal(validateEmail('invalidemail'), 'Ошибка: Неверный формат email');
  assert.equal(validateEmail('____@mail.com'), 'Ошибка: Неверный формат email');
  assert.equal(validateEmail('hhhhh @ g m a i l . c o m'), 'Ошибка: Неверный формат email');
});

test('step3', () => {
  assert.equal(validatePassword('pass@word1'), 'Пароль валиден');
  assert.equal(validatePassword('pass!word1'), 'Пароль валиден');
  assert.equal(validatePassword('_password'), 'Пароль валиден');
});

test('step4', () => {
  assert.equal(validatePassword('password'), 'Ошибка: Пароль должен содержать спец. символы');
});

test('step5', () => {

});
