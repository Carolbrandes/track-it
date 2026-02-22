'use client';

import { useEffect, useState } from 'react';

export const useDeviceDetect = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {

            const checkIfMobile = () => {

                const screenWidth = window.innerWidth;

                const userAgent = window.navigator.userAgent.toLowerCase();
                const mobileUserAgents = [
                    /android/i,
                    /webos/i,
                    /iphone/i,
                    /ipad/i,
                    /ipod/i,
                    /blackberry/i,
                    /windows phone/i
                ];

                const isMobileScreen = screenWidth < 1200;
                const isMobileUA = mobileUserAgents.some(agent => userAgent.match(agent));

                setIsMobile(isMobileScreen || isMobileUA);
            };


            checkIfMobile();


            const handleResize = () => {
                checkIfMobile();
            };

            window.addEventListener('resize', handleResize);


            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    return { isMobile };
};