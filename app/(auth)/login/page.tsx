export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-xl p-6 shadow-xl">
        
        <h1 className="text-2xl font-semibold text-white mb-1">ABASA</h1>
        <p className="text-sm text-neutral-400 mb-6">Sign in to your account</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
          >
            Continue
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 mt-4">
          ABASA — login
        </p>
      </div>
    </div>
  );
}
