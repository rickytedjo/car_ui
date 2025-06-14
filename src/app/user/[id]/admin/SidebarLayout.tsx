'use server';
import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

async function getUserIdFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
    return decoded.sub;
  } catch {
    return null;
  }
}

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default async function SidebarLayout({ children }: SidebarLayoutProps) {
  const userId = await getUserIdFromCookie();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
        <div className="text-2xl font-bold mb-8">Car Next - Admin</div>
        <nav className="flex flex-col gap-4">
          <Link href={`/user/${userId}/admin/dashboard`} className="hover:text-gray-300">Dashboard</Link>
          <Link href={`/user/${userId}/admin/user`} className="hover:text-gray-300">Users</Link>
          <Link href={`/user/${userId}/admin/booking`} className="hover:text-gray-300">Bookings</Link>
          <Link href={`/user/${userId}/admin/driver`} className="hover:text-gray-300">Drivers</Link>
          <Link href={`/user/${userId}/admin/vehicle`} className="hover:text-gray-300">Vehicles</Link>
          <Link href="/signin" className="hover:text-gray-300">Sign-out</Link>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
