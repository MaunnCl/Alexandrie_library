import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Carousel from '../components/Carousel';
import GridSection from '../components/GridSection';
import Footer from '../components/Footer';
import ContinueWatchingSection from '../components/ContinueWatchingSection';

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Carousel />
      <ContinueWatchingSection />
      <GridSection />
      <Footer />
    </>
  );
}

export default Home;
