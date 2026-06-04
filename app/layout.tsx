// app/layout.tsx
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata = {
  title: "ABASA Sport",
  description: "Sportska platforma za klubove i članove",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr">
      <body className="bg-gray-50 text-gray-900">
        <div className="min-h-screen flex">
          <Sidebar />
          <main className="flex-1 p-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
