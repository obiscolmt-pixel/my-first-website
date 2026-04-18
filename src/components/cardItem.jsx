function CardItem({ title, text, image }) {
  return (
    <div className="relative rounded-xl overflow-hidden">

      <img
        src={image}
        className="w-full h-[200px] object-cover"
      />

      <div className="absolute inset-0 bg-black/40 text-white p-4">

        <h2 className="text-xl font-bold">{title}</h2>
        <p>{text}</p>

        <button className="bg-white text-black mt-3 px-3 py-1 rounded-full">
          Order Now
        </button>

      </div>

    </div>
  )
}

export default CardItem
