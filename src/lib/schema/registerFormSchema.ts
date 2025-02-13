import { z } from 'zod';

const registerSchema = z
  .object({
    email: z.string().email('Niepoprawny adres e-mail!'),
    password: z.string().min(5, 'Hasło musi mieć co najmniej 5 znaków!'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła się nie zgadzają!',
    path: ['confirmPassword'],
  });

export default registerSchema;
