import NavLink from "./NavLink"; 
import Link from "next/link";

function AdminHeader() {
  return (
    <header className="navbar bg-base-100">
    <Link className="btn btn-ghost text-xl" href="/">NatureTech</Link>
    <ul className='menu menu-horizontal px-1'>
        <NavLink pathname="dashboard"/>
        <NavLink pathname="customers"/>
        <NavLink pathname="products"/>
        <NavLink pathname="sales"/>        
    </ul>
  </header>
  )
}

export default AdminHeader