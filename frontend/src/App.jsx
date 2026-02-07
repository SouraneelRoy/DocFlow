import React from 'react';
import { Navigation } from './components/sections/Navigation';
import { Hero } from './components/sections/Hero';
import { Features } from './components/sections/Features';
import ShaderBackground from './components/backgrounds/ShaderBackground';

function App() {
  return (
    <>
      <ShaderBackground />
      <Navigation />
      <main className="w-full relative z-10 selection:bg-white/20 selection:text-white">
        <Hero />
        <Features />
      </main>
      <footer className="w-full py-12 relative z-10 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-10 lg:px-16 text-center text-white/40 font-light text-sm">
          &copy; {new Date().getFullYear()} Generative Surfaces. All rights reserved.
        </div>
      </footer>
    </>
  );
}

export default App;
