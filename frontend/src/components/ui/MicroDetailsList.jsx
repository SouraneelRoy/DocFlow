import React from 'react';
import { cn } from '../../lib/utils';

const MicroDetailsList = ({ items = [], className }) => {
    return (
        <ul className={cn("flex flex-wrap gap-6 text-xs font-extralight tracking-tight text-white/60", className)}>
            {items.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-white/40" />
                    {item}
                </li>
            ))}
        </ul>
    );
};

export { MicroDetailsList };
