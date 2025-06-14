import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function redirectAfterLogin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    redirect('/signin');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      is_admin: boolean;
    };
  } catch (err) {
    console.error('Invalid token during login redirect:', err);
    redirect('/signin');
  }
  // console.log('Decoded JWT:', decoded);

  const { sub, is_admin} = decoded;

  const role = is_admin ? 'admin' : 'user';
  const target = `/user/${sub}/${role}/dashboard`;

  redirect(target);
}
