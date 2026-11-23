import Backdrop from '@/components/Backdrop';
import Nav from '@/components/Nav';
import Scene from '@/components/Scene';
import Home from '@/components/sections/Home';
import About from '@/components/sections/About';
import Works from '@/components/sections/Works';
import Stack from '@/components/sections/Stack';
import Experience from '@/components/sections/Experience';
import Contact from '@/components/sections/Contact';

export default function Page() {
  return (
    <>
      <Backdrop />
      <Nav />
      <main>
        <Home />
        <About />
        <Works />
        <Stack />
        <Experience />
        <Contact />
      </main>
      <Scene />
    </>
  );
}
