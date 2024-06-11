import Footer from "./components/Footer";
import Header from "./components/Header";
import dbConnect from "./lib/db"
await dbConnect(); 

export default function Home() {
  return (
    <div className="h-[100vh] bg-[var(--dark-gray)]">
    <Header/>
    </div>
  );
}
