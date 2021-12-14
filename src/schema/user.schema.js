import * as yup from 'yup';

export const createUserValidationSchema = yup.object().shape({
  body: yup.object({
    name: yup.string().required("User name is required")
      .min(3).max(128).trim(),
    password: yup.string()
      .required("Password is required")
      .min(6, "Password must be greater than 6 characters")
      .max(72, 'utf8')
      .matches(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u, { message: "password must contain one uppercase letter, one lowercase letter, and one digit." }),
    confirmPassword: yup.string().required("Confirm Password is required")
      .oneOf([yup.ref('password')], 'Passwords must match'),
    email: yup.string().required("Email field is required")
      .email("Not a valid email").min(8).max(254)
      .lowercase().trim()
      .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, { message: "Not a valid email address" })
  })
});

export const createEmailValidationSchema = yup.object().shape({
  body: yup.object({
    email: yup.string().required("Email field is required")
      .email("Not a valid email").min(8).max(254)
      .lowercase().trim()
  })
})

export const createPasswordValidationSchema = yup.object().shape({
  body: yup.object({
    password: yup.string()
      .required("Password is required")
      .min(6, "Password must be greater than 6 characters")
      .max(72, 'utf8')
      .matches(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u, { message: "password must contain one uppercase letter, one lowercase letter, and one digit." })
  })
})
/*
 .when('password', (password, schema) => {
        if (password) return schema.required('');
      })
*/