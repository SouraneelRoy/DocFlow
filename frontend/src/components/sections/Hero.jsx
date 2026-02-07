import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MicroDetailsList } from '../ui/MicroDetailsList';
import { cn } from '../../lib/utils'; // Assuming cn util is available

const Hero = ({
    title = "Redefining digital surfaces through generative design",
    description = "Experience the fusion of algorithmic art and modern web design. Every pixel tells a story.",
    badgeText = "Generative Surfaces",
    badgeLabel = "New",
    microDetails = ["Low-weight font", "Tight tracking", "Subtle motion"]
}) => {
    const containerRef = useRef(null);

    useGSAP(() => {
        const items = gsap.utils.toArray('.hero-anim');

        gsap.set(items, {
            y: 30,
            opacity: 0,
            filter: 'blur(10px)',
            scale: 1.02
        });

        gsap.to(items, {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
            duration: 1,
            stagger: 0.1,
            delay: 0.2,
            ease: 'power3.out'
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative z-10 w-full pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
            <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
                <div className="flex flex-col items-start gap-8 max-w-4xl">
                    {/* Badge */}
                    <div className="hero-anim">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                            <span className="text-[10px] uppercase font-light tracking-wide text-white/70">{badgeLabel}</span>
                            <span className="w-1 h-1 bg-white/40 rounded-full" />
                            <span className="text-xs font-light text-white/90">{badgeText}</span>
                        </div>
                        {/* Note: Badge is wrapped to apply animation cleanly */}
                    </div>

                    {/* Heading */}
                    <h1 className="hero-anim text-5xl md:text-7xl font-extralight leading-[1.05] tracking-tighter text-white">
                        {title}
                    </h1>

                    {/* Description */}
                    <p className="hero-anim text-lg md:text-xl font-light leading-relaxed tracking-tight text-white/75 max-w-2xl">
                        {description}
                    </p>

                    {/* Buttons */}
                    <div className="hero-anim flex flex-wrap gap-4 mt-2">
                        <Button variant="primary" size="medium" href="#start">
                            Get started
                        </Button>
                        <Button variant="secondary" size="medium" href="#showcase">
                            View showcase
                        </Button>
                    </div>

                    {/* Micro Details */}
                    <div className="hero-anim mt-8">
                        <ul className="flex flex-wrap gap-6 text-xs font-extralight tracking-tight text-white/60">
                            {microDetails.map((item, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-white/40" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Hero };
