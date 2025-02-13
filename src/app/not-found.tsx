import Link from 'next/link';
import { Button } from '@/components/ui/button';

function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <h1 className="text-7xl font-bold text-red-600">404</h1>
      <p className="mt-4 text-xl text-gray-700">
        Ups! Strona, której szukasz, nie istnieje.
      </p>
      <Link href="/login">
        <Button className="mt-6">Wróć do logowania</Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
