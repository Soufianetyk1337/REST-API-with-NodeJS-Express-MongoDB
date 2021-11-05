import * as yup from 'yup';
import { object } from 'yup';
export const createSessionValidationSchema = object().shape({
  body: yup.object({
    email: yup.string().required("Email field is required").email("Not a valid email"),
    password: yup.string().required("Password field is required").min(6, "Password must be greater than 6 characters"),
  })
});
