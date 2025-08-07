import React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import '../../styles/ui/_progress.scss';

export function Progress( { className = '', value = 0, ...props }) { 
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={`progress-root ${className}`}
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