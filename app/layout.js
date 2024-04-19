import "./globals.css";
import { CartProvider } from "./context/cartContext";

export const metadata = {
  title: "Nature Tech",
  description: "Nature Tech",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
