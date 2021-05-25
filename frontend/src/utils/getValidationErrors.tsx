import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

interface MyValidationError extends ValidationError {
  path: string;
  inner: MyValidationError[];
}

export default function getValidationErrors(errors: MyValidationError): Errors {
  const validationErrors: Errors = {};

  errors.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
