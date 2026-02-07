import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

const featuresData = [
    {
        title: "Algorithmic Precision",
        description: "Our core engine generates patterns with mathematical perfection, ensuring seamless loops and scalable vector outputs.",
        href: "#learn-precision",
        badge: "Core"
    },
    {
        title: "Dynamic Rendering",
        description: "Render complex shaders in real-time with WebGL optimization, providing smooth 60fps experiences across devices.",
        href: "#learn-rendering",
        badge: "Info"
    },
    {
        title: "Reactive Interfaces",
        description: "Every element responds to user interaction. Hover, scroll, and click to manipulate the generative surface.",
        href: "#learn-interaction",
        badge: "UX"
    }
];

const Features = () => {
    const containerRef = React.useRef(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray('.feature-card');

        gsap.from(cards, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            ease: "power3.out"
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 relative z-10 w-full overflow-hidden">
            <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-extralight text-white mb-6 tracking-tight">
                        Built for the future
                    </h2>
                    <p className="text-white/60 font-light max-w-2xl mx-auto text-lg">
                        Explore a suite of tools designed for the next generation of digital experiences.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresData.map((feature, index) => (
                        <Card key={index} className="feature-card h-full flex flex-col justify-between group">
                            <div>
                                <div className="mb-6">
                                    <Badge label={feature.badge} value={`0${index + 1}`} />
                                </div>
                                <h3 className="text-2xl font-light tracking-tight text-white mb-4 group-hover:text-white transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-base font-light leading-relaxed text-white/70 group-hover:text-white/90 transition-colors duration-300">
                                    {feature.description}
                                </p>
                            </div>

                            <a href={feature.href} className="mt-8 inline-flex items-center gap-2 text-sm font-light text-white/80 hover:text-white group-hover:translate-x-1 transition-transform duration-300">
                                Learn more
                                <span className="text-white/40 group-hover:text-white transition-colors">→</span>
                            </a>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export { Features };
