import Card from './Card';
import Carousel from './Carousel';

//TODO:Lets turn this into a carousel type image viewer

const HomeCards = () => {


  return (
    <section className='py-4 bg-amber-300'>
      <div className='container-xl lg:container m-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg'>
          <Carousel/>
        </div>
      </div>
    </section>
  )
}

export default HomeCards