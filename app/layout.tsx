// (GITHUB-PUTANJA-FILE: /abasa-sport/app/layout.tsx)

import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ABASA Sport",
  description: "ABASA — Powered by Copilot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">

          {/* MAIN CONTENT */}
          <main className="flex-1">
            {children}
          </main>

          {/* FOOTER */}
          <footer className="footer">
            ABASA — Powered by Copilot
          </footer>

        </div>
      </body>
    </html>
  );
}
