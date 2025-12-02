import React from 'react';
import { cn } from '../../utils/cn'; // We'll create this utility next

const Button = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    ...props
}) => {
    const variants = {
        primary: 'bg-blue-500 text-white border-b-4 border-blue-700 active:border-b-0 active:translate-y-1',
        success: 'bg-green-500 text-white border-b-4 border-green-700 active:border-b-0 active:translate-y-1',
        danger: 'bg-red-500 text-white border-b-4 border-red-700 active:border-b-0 active:translate-y-1',
        warning: 'bg-yellow-400 text-yellow-900 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    };

    const sizes = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-6 py-3 text-lg',
        lg: 'px-8 py-4 text-xl',
        xl: 'px-10 py-5 text-2xl',
    };

    return (
        <button
            className={cn(
                'rounded-2xl font-bold shadow-lg transition-all transform',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
