import { ComponentPropsWithoutRef, FormEvent, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export function ForgotPasswordForm({
  className,
  ...props
}: ComponentPropsWithoutRef<'form'>) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Niepoprawny adres e-mail!');
      return;
    }

    setMessage(
      'Jeśli ten e-mail istnieje w naszej bazie, otrzymasz wiadomość z linkiem resetującym.',
    );
    setLoading(false);
  };

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Zapomniałeś hasła?</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Wpisz swój adres e-mail, aby zresetować hasło.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-green-500">{message}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Wysyłanie...' : 'Resetuj hasło'}
        </Button>
      </div>
      <div className="text-center text-sm">
        <Link href="/login" className="underline underline-offset-4">
          Powrót do logowania
        </Link>
      </div>
    </form>
  );
}
