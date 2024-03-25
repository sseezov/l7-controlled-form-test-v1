import _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';

export const validateName = (name) => (name.trim().length ? [] : ['name cannot be empty']);
export const validateEmail = (email) => (/\w+@\w+/.test(email) ? [] : ['invalid email']);
const validateField = (fieldname, data) => (fieldname === 'name' ? validateName(data) : validateEmail(data));

export const run = () => {
  const state = {
    errors: {
      name: [],
      email: [],
    },
    values: {
      name: '',
      email: '',
    },
  };

  const form = document.querySelector('form');
  const submit = document.querySelector('[type="submit"]');

  const hasErrors = () => (_.values(state.errors).reduce((acc, curr) => (curr.length > 0
    ? acc.concat(curr)
    : acc), [])
    .length > 0);

  const watchedState = onChange(state, (path) => {
    const selector = path.split('.')[1];
    const input = document.querySelector(`[name=${selector}]`);
    const isFieldValid = validateField(selector, state.values[selector]).length === 0;
    if (!isFieldValid) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    }
    submit.disabled = hasErrors(state);
  });

  form.addEventListener('input', (e) => {
    e.preventDefault();
    const targetName = e.target.name;
    const targetData = new FormData(form).get(targetName);
    watchedState.values[targetName] = targetData;
    watchedState.errors[targetName] = (validateField(targetName, targetData));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    axios.post('/users', state.values)
      .then((response) => {
        document.body.innerHTML = `<p>${response.data.message}</p>`;
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
