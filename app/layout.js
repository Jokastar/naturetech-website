
import "./globals.css";
import { CartProvider  } from "./context/cartContext";
import Header from "./components/Header";

export const metadata = {
  title: "Nature Tech",
  description: "Nature Tech",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>

        <CartProvider>
          <Header/>
          {children}
          </CartProvider>
      </body>
    </html>
  );
}
