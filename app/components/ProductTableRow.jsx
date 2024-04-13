import Link from 'next/link'

function ProductTableRow({name, price, orders, productId="1"}) {
  return (
      <tr className="hover">
        <td>{name}</td>
        <td>{price}</td>
        <td>{orders}</td>
      </tr>
  )
}

export default ProductTableRow