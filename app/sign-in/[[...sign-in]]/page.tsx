'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0E7FF] via-[#FCE7F3] to-[#F3E8FF] p-4">
      <SignIn forceRedirectUrl="/" fallbackRedirectUrl="/" />
    </div>
  );
}
