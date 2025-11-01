
import React from 'react';
import { HeartIcon } from './icons/HeartIcon';

export const Header: React.FC = () => {
    return (
        <header className="text-center p-4 md:p-6 border-b border-rose-200/50 bg-white/30 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3">
                <HeartIcon className="w-8 h-8 text-rose-500" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                    HeartSense
                </h1>
            </div>
            <p className="text-gray-500 mt-1">
                Your AI partner for practicing emotional connection.
            </p>
        </header>
    );
};
