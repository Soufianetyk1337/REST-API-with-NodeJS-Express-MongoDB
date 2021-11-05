import * as yup from 'yup';

export const createUserValidationSchema = yup.object().shape({
  body: yup.object({
    name: yup.string().required(),
    password: yup.string().required().min(6, "Password must be greater than 6 characters"),
    email: yup.string().required("Email field is required").email("Not a valid email")
  })
});
