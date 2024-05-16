import Footer from "./components/Footer";
import dbConnect from "./lib/db"
await dbConnect(); 

export default function Home() {
  return (
    <main>
     <div className="hero-section bg-gray-200 w-full h-[90vh] flex items-center justify-center">
      <p className="text-center">HERO SECTION</p>
     </div>
     <div className="products-image grid grid-cols-2 gap-2 h-[80vh] my-2">
      <div className="product_1 bg-gray-200 flex items-center justify-center">
        <p>Product 1</p>
      </div>
      <div className="product_2 bg-gray-200 flex items-center justify-center">
        <p>Product 2</p>
      </div>
     </div>
     <div className="call_to_action bg-gray-200 w-full h-[90vh] flex items-center justify-center">
      <p className="text-center">CALL TO ACTION</p>
     </div>
     <Footer/>
    </main>
  );
}
