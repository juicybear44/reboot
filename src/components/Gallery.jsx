import Card from './Card';
import Carousel from './Carousel';

//TODO:Lets turn this into a carousel type image viewer

const Gallery = () => {


  return (
    <section className='py-4 bg-amber-300'>
      <div className='container-xl lg:container m-auto'>
          <Carousel/>
      </div>
    </section>
  )
}

export default Gallery