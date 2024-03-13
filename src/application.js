export const validateName = (name) => (name.trim().length ? {} : { errors: ['имя не может быть пустым'] });

export const validateEmail = (email) => (/\w+@\w+/.test(email) ? {} : { errors: ['невалидный email'] });

export default () => {};
