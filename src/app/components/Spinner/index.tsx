'use client'

interface SpinnerProps {
    fullPage?: boolean;
}

export const Spinner = ({ fullPage = false }: SpinnerProps) => {
    if (fullPage) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;
};
