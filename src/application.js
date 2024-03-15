export const validateName = (name) => (name.trim().length ? {} : { errors: ['имя не может быть пустым'] });

export const validateEmail = (email) => (/\w+@\w+/.test(email) ? {} : { errors: ['невалидный email'] });

export default () => {
  const form = document.querySelector('form');
  const submit = document.querySelector('[type="submit"]');
  const validate = (name, email) => {
    const r = ({ ...validateName(name), ...validateEmail(email) }).errors
      ? submit.disabled = true
      : submit.disabled = false;
    console.log(r);
  };

  form.addEventListener('input', () => {
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    console.log(111, validate(name, email));
  });
};
