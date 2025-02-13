'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import registerSchema from '@/lib/schema/registerFormSchema';
import api from '@/lib/api/api';
import { z } from 'zod';

function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (formData: z.infer<typeof registerSchema>) => {
    setLoading(true);
    setSuccessMessage('');
    try {
      const response = await api.post('/auth/register', formData);

      if (response.status === 409) {
        form.setError('email', {
          type: 'manual',
          message: 'Użytkownik już istnieje.',
        });
      } else {
        console.log('Rejestracja udana:', response.data);
        setSuccessMessage('Konto zostało stworzone!');
      }
    } catch (err) {
      console.error(err);
      form.setError('password', {
        type: 'manual',
        message: 'Wystąpił błąd. Spróbuj ponownie.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className={'flex flex-col gap-6'}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Zarejestruj się!</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Wpisz swoje dane, aby utworzyć konto.
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
                <Label htmlFor="password">Hasło</Label>
                <FormControl>
                  <Input id="password" type="password" required {...field} />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.password?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="confirmPassword">Powtórz hasło</Label>
                <FormControl>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.confirmPassword?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          {successMessage && (
            <p className="text-sm text-green-500">{successMessage}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Rejestracja...' : 'Zarejestruj się'}
          </Button>
        </div>
        <div className="text-center text-sm">
          Masz już konto?{' '}
          <Link href="/login" className="underline underline-offset-4">
            Zaloguj się
          </Link>
        </div>
      </form>
    </Form>
  );
}

export default RegisterForm;
