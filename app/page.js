import dbConnect from "./lib/db"
await dbConnect(); 

export default function Home() {
  return (
    <main>
      <p>Hello world</p>
    </main>
  );
}
