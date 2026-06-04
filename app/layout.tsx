import "./globals.css";

export const metadata = {
  title: "ABASA Sport",
  description: "Sportska platforma za klubove i članove",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hr">
      <body className="bg-gray-50 text-gray-900">
        <div className="min-h-screen flex">

          {/* SIDEBAR */}
          <aside className="w-64 bg-white border-r border-gray-200 p-6">
            <h1 className="text-2xl font-bold mb-8">ABASA Sport</h1>

            <nav className="space-y-4">
              <a href="/" className="block text-gray-700 hover:text-black">Početna</a>
              <a href="/dashboard" className="block text-gray-700 hover:text-black">Dashboard</a>
              <a href="/users" className="block text-gray-700 hover:text-black">Članovi</a>
              <a href="/club" className="block text-gray-700 hover:text-black">Klub</a>
              <a href="/settings" className="block text-gray-700 hover:text-black">Postavke</a>
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 p-10">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}
