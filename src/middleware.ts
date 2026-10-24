import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const authMiddleware = withAuth({
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  return (authMiddleware as any)(req);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
