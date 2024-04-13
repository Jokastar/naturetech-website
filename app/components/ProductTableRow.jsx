import Link from 'next/link'

function ProductTableRow({name, price, orders, productId}) {
  return (
    <Link href={"/products/" + productId}>
      <tr className="hover">
        <td>{name}</td>
        <td>{price}</td>
        <td>{orders}</td>
      </tr>
    </Link>
  )
}

export default ProductTableRow