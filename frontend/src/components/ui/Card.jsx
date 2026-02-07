import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Card = forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "rounded-[24px] border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:bg-white/8 hover:border-white/15",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = "Card";

export { Card };
