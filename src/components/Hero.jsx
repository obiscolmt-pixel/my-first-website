function Hero() {
  return (
    <div className="relative p-4">

      <img
        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
        className="w-full h-[400px] object-cover rounded-lg"
      />

      <div className="absolute top-20 left-10 text-white">

        <h1 className="text-5xl font-bold">
          The <span className="text-orange-500">Best</span>
        </h1>

        <h1 className="text-5xl font-bold">
          <span className="text-orange-500">Foods</span> Delivered
        </h1>

      </div>

    </div>
  )
}

export default Hero
