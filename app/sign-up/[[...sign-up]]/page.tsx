'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0E7FF] via-[#FCE7F3] to-[#F3E8FF] p-4">
      <SignUp forceRedirectUrl="/" fallbackRedirectUrl="/" />
    </div>
  );
}
