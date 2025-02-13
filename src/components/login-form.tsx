'use client';

import { useRouter } from 'next/navigation';
import { FC, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import api from '@/lib/api/api';
import loginSchema from '@/lib/schema/loginFormSchema';
import { AuthContext, AuthContextType } from '@/context/authContext';

const LoginForm: FC = () => {
  const { login } = useContext(AuthContext) as AuthContextType;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', values);
      console.log('Logowanie udane:', response.data);

      const { accessToken, refreshToken } = response.data;
      login(accessToken, refreshToken);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      form.setError('password', {
        type: 'manual',
        message: 'Nieprawidłowe dane logowania. Spróbuj ponownie.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={'flex flex-col gap-6'}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Zaloguj się!</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Wpisz swoje dane, aby zalogować się do konta.
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">E-mail</Label>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@gmail.com"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.email?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Hasło</Label>
                  <Link href={'/forgot-password'}>
                    <span className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                      Zapomniałeś hasła?
                    </span>
                  </Link>
                </div>
                <FormControl>
                  <Input id="password" type="password" required {...field} />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.password?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </Button>
        </div>
        <div className="text-center text-sm">
          Nie masz konta?{' '}
          <Link href="/register" className="underline underline-offset-4">
            Zarejestruj się
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
