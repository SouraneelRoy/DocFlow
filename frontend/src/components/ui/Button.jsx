import React from 'react';
import { cn } from '../../lib/utils';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const Button = React.forwardRef(({
    className,
    variant = 'primary',
    size = 'medium',
    children,
    href,
    onClick,
    ...props
}, ref) => {
    const baseStyles = "inline-flex items-center justify-center border border-white/10 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 tracking-tight font-light";

    const variants = {
        primary: "bg-white/10 text-white hover:bg-white/20",
        secondary: "bg-transparent text-white/80 hover:bg-white/5 hover:text-white",
    };

    const sizes = {
        small: "px-4 py-2 text-xs rounded-xl",   // 8px 16px -> px-4 py-2 (tailwind spacing)
        medium: "px-5 py-3 text-sm rounded-2xl", // 12px 20px -> px-5 py-3
        large: "px-7 py-4 text-base rounded-[20px]", // 16px 28px -> px-7 py-4
    };

    const Component = href ? 'a' : 'button';

    return (
        <Component
            ref={ref}
            href={href}
            onClick={onClick}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </Component>
    );
});

Button.displayName = "Button";

export { Button };
