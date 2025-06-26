import Card from './Card';

//TODO:Lets turn this into a carousel type image viewer

const HomeCards = () => {


  return (
    <section className='py-4 bg-amber-300'>
      <div className='container-xl lg:container m-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg'>
          {/* TODO: Lets loop through these cards and dynamically generate them */}

          <Card bg='bg-yellow-50'>
            <h2 className='text-2xl font-bold'>Cupcake Ipsum</h2>
            <p className='mt-2 mb-4'>
              Pie topping pastry ice cream cheesecake. Cake pie jelly beans marzipan cake soufflé. Chupa chups tiramisu jujubes bonbon tootsie roll. Cupcake jelly beans marzipan sugar plum cake sugar plum. Sesame snaps gummi bears lollipop tiramisu sweet roll jelly-o. Lemon drops cotton candy danish caramels tiramisu topping cupcake jelly halvah.
            </p>
            <a
              to='/jobs'
              className='inline-block bg-yellow-500 text-white rounded-lg px-4 py-2 hover:bg-gray-700'
            >
              Browse Jobs
            </a>
          </Card>
          <Card bg='bg-yellow-50'>
            <h2 className='text-2xl font-bold'>Pirate Ipsum</h2>
            <p className='mt-2 mb-4'>
              Bring a spring upon her cable holystone blow the man down spanker Shiver me timbers to go on account lookout wherry doubloon chase. Belay yo-ho-ho keelhaul squiffy black spot yardarm spyglass sheet transom heave to.
            </p>
            <a
              to='/add-job'
              className='inline-block bg-yellow-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600'
            >
              Add Job
            </a>
          </Card>
          <Card bg='bg-yellow-50'>
            <h2 className='text-2xl font-bold'>Tuna Ipsum</h2>
            <p className='mt-2 mb-4'>
              Atka mackerel basslet, smalltooth sawfish queen parrotfish banjo catfish sleeper shark sea snail northern anchovy carpsucker. Swordfish whale catfish kelpfish starry flounder, darter antenna codlet goldeye bottlenose frogmouth catfish spiny eel.
            </p>
            <a
              to='/add-job'
              className='inline-block bg-yellow-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600'
            >
              Add Job
            </a>
          </Card>
            <Card bg='bg-yellow-50'>
            <h2 className='text-2xl font-bold'>Coffee Ipsum</h2>
            <p className='mt-2 mb-4'>
              Cream, milk, white, filter organic cinnamon so skinny variety aromatic roast seasonal id white ut foam latte. Seasonal cream robust percolator barista, cinnamon, cup, skinny bar  caffeine est, pumpkin spice latte affogato crema fair trade wings trifecta. Steamed seasonal americano et sugar doppio whipped, sit, froth steamed coffee aroma, frappuccino whipped flavour cappuccino strong arabica aroma, breve skinny coffee sit milk. 
            </p>
            <a
              to='/add-job'
              className='inline-block bg-yellow-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600'
            >
              Add Job
            </a>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default HomeCards