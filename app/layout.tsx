export const metadata = {
  title: "ABASA",
  description: "Management Panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
