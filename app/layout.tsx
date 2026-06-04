import "./globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

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
          <Sidebar />

          {/* MAIN CONTENT */}
          <main className="flex-1 p-10">
            <Header />
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}
