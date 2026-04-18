import { FaShoppingCart } from "react-icons/fa"

function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 shadow-md">

      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">
          Best <span className="text-black">Eats</span>
        </h1>

        <button className="bg-black text-white px-3 py-1 rounded-full">
          Delivery
        </button>

        <button className="bg-gray-200 px-3 py-1 rounded-full">
          Pickup
        </button>
      </div>

      <input
        className="border rounded-full px-4 py-1 w-96"
        placeholder="Search foods"
      />

      <button className="bg-black text-white px-4 py-2 rounded-full flex items-center gap-2">
        <FaShoppingCart />
        Cart
      </button>

    </div>
  )
}

export default Navbar
