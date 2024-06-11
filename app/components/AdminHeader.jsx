import Link from "next/link";

function AdminHeader() {
  return (
    <header className="flex items-center gap-2">
    <Link className="btn btn-ghost text-xl" href="/">NatureTech</Link>
    <ul className='menu menu-horizontal px-1'>
    <li><Link href={"/admin"}>Dashboard</Link></li>
        <li><Link href={"/admin/customers"}>Customers</Link></li>
        <li><Link href={"/admin/orders"}>Orders</Link></li>      
        <li><Link href={"/admin/products"}>products</Link></li>            
    </ul>
  </header>
  )
}

export default AdminHeader; 