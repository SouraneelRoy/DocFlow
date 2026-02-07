import React from 'react';
import { cn } from '../../lib/utils';

const Link = ({ href, children, variant = "default", className, ...props }) => {
    const variants = {
        default: "text-white/80 hover:text-white transition-colors duration-200 font-light no-underline",
        underline: "text-white/80 hover:text-white transition-colors duration-200 font-light border-b border-white/20 hover:border-white/60 pb-0.5",
    };

    return (
        <a
            href={href}
            className={cn(variants[variant], className)}
            {...props}
        >
            {children}
        </a>
    );
};

export { Link };
