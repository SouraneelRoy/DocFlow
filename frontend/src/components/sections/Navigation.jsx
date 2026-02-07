import React from 'react';
import { Button } from '../ui/Button';
import { Link } from '../ui/Link';

const Navigation = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 backdrop-blur-md bg-transparent">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                {/* Logo */}
                <div className="text-xl font-light tracking-widest text-white uppercase">
                    Generative
                </div>

                {/* Links */}
                <div className="hidden md:flex items-center gap-8">
                    {['Features', 'Showcase', 'Pricing', 'About'].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-sm text-white/70 hover:text-white"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4">
                    <Button variant="secondary" size="small" className="hidden sm:inline-flex">
                        Log in
                    </Button>
                    <Button variant="primary" size="small">
                        Get Started
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export { Navigation };
