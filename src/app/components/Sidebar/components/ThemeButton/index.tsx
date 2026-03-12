'use client';

import { FaMoon } from "react-icons/fa6";
import { MdWbSunny } from "react-icons/md";
import { cn } from '@/app/lib/cn';
import { useTheme } from '../../../../hooks/useTheme';

export const ThemeButton = () => {
    const { toggleTheme, isLightTheme } = useTheme();

    return (
        <button type="button" className="flex items-center bg-transparent border-none p-0 cursor-pointer" onClick={toggleTheme}>
            <div className="relative w-12 h-[26px]">
                <input
                    type="checkbox"
                    checked={!isLightTheme}
                    onChange={toggleTheme}
                    aria-label="Toggle theme"
                    className="opacity-0 w-0 h-0"
                />
                <span
                    className={cn(
                        "absolute cursor-pointer inset-0 bg-gray-300 transition-all duration-300 rounded-[26px] flex items-center px-1",
                        isLightTheme ? "justify-start" : "justify-end"
                    )}
                >
                    <span
                        className={cn(
                            "absolute h-5 w-5 bottom-[3px] bg-primary transition-all duration-300 rounded-full",
                            isLightTheme ? "left-[25px]" : "left-[3px]"
                        )}
                    />
                    {isLightTheme ? (
                        <FaMoon
                            size={14}
                            className={cn(
                                "text-primary z-[1] absolute right-[27px] w-3.5 h-3.5 transition-opacity duration-300",
                                isLightTheme ? "opacity-100" : "opacity-0"
                            )}
                        />
                    ) : (
                        <MdWbSunny
                            size={14}
                            className={cn(
                                "text-primary z-[1] absolute left-[27px] w-3.5 h-3.5 transition-opacity duration-300",
                                isLightTheme ? "opacity-0" : "opacity-100"
                            )}
                        />
                    )}
                </span>
            </div>
        </button>
    );
};
