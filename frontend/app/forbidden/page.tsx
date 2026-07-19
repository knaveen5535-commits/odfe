import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F4EA]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">403</h1>
        <p className="text-xl mt-4 text-[#2C1810]">Access Forbidden</p>
        <p className="text-[#6B5B4F] mt-2">You do not have permission to access this page.</p>
        <Link href="/login" className="text-[#A56A2B] hover:text-[#A56A2B]-hover mt-6 inline-block font-medium">Go to Login</Link>
      </div>
    </div>
  );
}