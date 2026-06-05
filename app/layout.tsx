import "./globals.css";
import type { ReactNode } from "react";
import RootProvider from "./providers/RootProvider";

export const metadata = {
  title: "ABASA",
  description: "ABASA Clean App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
