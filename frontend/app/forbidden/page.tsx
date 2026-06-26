import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-danger">403</h1>
        <p className="text-xl mt-4 text-[#2B1D15]">Access Forbidden</p>
        <p className="text-secondary-text mt-2">You do not have permission to access this page.</p>
        <Link href="/login" className="text-primary hover:text-primary-hover mt-6 inline-block font-medium">Go to Login</Link>
      </div>
    </div>
  );
}