'use client';

import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';

export default function HrLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post(
        '/auth/signin',
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      router.push('/redirect');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white flex flex-col justify-center w-full md:w-1/2 p-8">
        {/* Login Text up here--- */}
        <h1 className="text-4xl font-bold text-center mb-8">Login</h1>
        <div className="max-w-md w-full mx-auto"> 
            {/* Center the form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-gray-700 border-zinc-600"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                 onChange={(e) => setPassword(e.target.value)}
                className="text-gray-700 border-zinc-600"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
