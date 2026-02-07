import React from 'react';
import { cn } from '../../lib/utils';

const Badge = ({ label, value, className, ...props }) => {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm",
                className
            )}
            {...props}
        >
            <span className="text-[10px] uppercase font-light tracking-wide text-white/70">
                {label}
            </span>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <span className="text-xs font-light text-white/90">
                {value}
            </span>
        </div>
    );
};

export { Badge };
