import React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

export function Progress( { className = '', value = 0, ...props }) { 
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={`progress-root ${className}`}
            value={value}
            max={100}
            {...props}
        >
            <ProgressPrimitive.Indicator 
            data-slot="progress-indicator"
            className="progress-indicator" 
            style={{ transform: `translateX(-${100 - value}%)` }}
            />
        </ProgressPrimitive.Root>
    );
}