import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Carousel from '../components/Carousel';
import GridSection from '../components/GridSection';
import Footer from '../components/Footer';
import ContinueWatchingSection from '../components/ContinueWatchingSection';
import WatchHistorySection from '../components/WatchHistorySection';

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Carousel />
      <GridSection />
      <ContinueWatchingSection />
      <WatchHistorySection />
      <Footer />
    </>
  );
}

export default Home;
