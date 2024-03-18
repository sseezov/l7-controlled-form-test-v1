import _ from 'lodash';
import onChange from 'on-change';

export const validateName = (name) => (name.trim().length ? [] : ['name cannot be empty']);
export const validateEmail = (email) => (/\w+@\w+/.test(email) ? [] : ['invalid email']);
const validateField = (fieldname, data) => (fieldname === 'name' ? validateName(data) : validateEmail(data));

export default () => {
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

  const validate = () => (_.values(state.errors).reduce((acc, curr) => (curr.length > 0
    ? acc.concat(curr)
    : acc), [])
    .length > 0);

  const watchedState = onChange(state, (path) => {
    const selector = path.split('.')[1];
    const input = document.querySelector(`[name=${selector}]`);
    if (validateField(selector, state.values[selector]).length > 0) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    }
    submit.disabled = validate(state);
  });

  form.addEventListener('input', (e) => {
    e.preventDefault();
    const targetName = e.target.name;
    const targetData = new FormData(form).get(targetName);
    watchedState.values[targetName] = targetData;
    watchedState.errors[targetName] = (validateField(targetName, targetData));
  });
};
