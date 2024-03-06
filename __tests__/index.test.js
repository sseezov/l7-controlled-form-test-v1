import { test } from 'node:test';
import assert from 'assert/strict';
import { validateEmail, validateName } from '../src/index.js';

test('step1', () => {
  assert.deepEqual(validateName('example@gmail.com'), {});
  assert.deepEqual(validateName('e'), {});
  assert.deepEqual(validateName('  '), {errors: ['имя не может быть пустым']});
  assert.deepEqual(validateName(''), {errors: ['имя не может быть пустым']});
});

test('step2', () => {
  assert.deepEqual(validateEmail('invalidemail'), {errors: ['невалидный email']});
  assert.deepEqual(validateEmail(' @mail.com'), {errors: ['невалидный email']});
  assert.deepEqual(validateEmail('hhhhh @ g m a i l . c o m'), {errors: ['невалидный email']});
  assert.deepEqual(validateEmail('s@s'), {});
});
