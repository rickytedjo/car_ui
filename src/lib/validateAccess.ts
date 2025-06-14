import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

const JWT_SECRET = process.env.JWT_SECRET!;

type ValidateAccessOptions = {
  requireAdmin: boolean;
  currentPathId: string;
  section?: string;
};

export async function validateAccess({
  requireAdmin,
  currentPathId,
  section,
}: ValidateAccessOptions) {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  const redirectPath = requireAdmin ? '/signin' : '/signin/employee';

  if (!token) {
    return redirect(redirectPath);
  }

  let decoded: {
    sub: string;
    is_admin: boolean;
  };

  try {
    decoded = jwt.verify(token, JWT_SECRET) as typeof decoded;
  } catch (err) {
    console.error('Invalid token:', err);
    return redirect(redirectPath);
  }

  const { sub, is_admin } = decoded;

  const expectedPath = section
    ? `/user/${sub}/${is_admin ? 'admin' : 'employee'}/${section}`
    : `/user/${sub}/${is_admin ? 'admin' : 'employee'}/dashboard`;

  const isWrongUser = currentPathId !== sub;
  const isRoleMismatch =
    (requireAdmin && !is_admin) || (!requireAdmin && is_admin);

  if (isWrongUser || isRoleMismatch) {
    return redirect(expectedPath);
  }

  return { sub, is_admin };
}
