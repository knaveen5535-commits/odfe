export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">403</h1>
        <p className="text-xl mt-4">Access Forbidden</p>
        <a href="/login" className="text-blue-600 mt-4 inline-block">Go to Login</a>
      </div>
    </div>
  );
}
