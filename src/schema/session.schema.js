import * as yup from 'yup';
import { object } from 'yup';
export const createSessionValidationSchema = object().shape({
  body: yup.object({
    email: yup.string().required("Email field is required")
      .email("Not a valid email").min(8).max(254)
      .lowercase().trim(),
    password: yup.string()
      .required("Password is required")
      .min(6, "Password must be greater than 6 characters")
      .max(72, 'utf8')
      .matches(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u, { message: "password must contain one uppercase letter, one lowercase letter, and one digit." }),
  })
});
