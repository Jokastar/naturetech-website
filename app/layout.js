import "./globals.css";

export const metadata = {
  title: "Nature Tech",
  description: "Nature Tech",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
