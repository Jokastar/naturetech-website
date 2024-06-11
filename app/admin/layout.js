import AdminHeader from "../components/AdminHeader";
export const metadata = {
    title: "Nature Tech",
    description: "Nature Tech",
  };

export default function AdminLayout({ children }) {
    return (
      <html lang="fr">
        <body>
            {children}
        </body>
      </html>
    );
  }