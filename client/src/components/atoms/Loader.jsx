const Loader = ({ fullScreen = false, size = 'md' }) => {
    const sizeClasses = { sm: 'w-6 h-6 border-2', md: 'w-10 h-10 border-3', lg: 'w-16 h-16 border-4', };
    const spinner = (
        <div className={`${sizeClasses[size]} border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin`} />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
                <div className="flex flex-col items-center gap-4">
                    {spinner}
                    <p className="text-neutral-600 font-medium animate-pulse">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-12">
            {spinner}
        </div>
    );
};

export default Loader;