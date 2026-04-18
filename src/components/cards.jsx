import CardItem from "./CardItem"

function Cards() {
  return (
    <div className="grid md:grid-cols-3 gap-6 p-4">

      <CardItem
        title="Sun's Out, BOGO's Out"
        text="Through 9/28"
        image="https://images.unsplash.com/photo-1525351484163-7529414344d8"
      />

      <CardItem
        title="New Restaurants"
        text="Added Daily"
        image="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
      />

      <CardItem
        title="We Deliver Desserts Too"
        text="Tasty Treats"
        image="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3"
      />

    </div>
  )
}

export default Cards
