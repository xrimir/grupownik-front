import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email('Niepoprawny adres e-mail!'),
  password: z.string(),
});

export default loginSchema;
