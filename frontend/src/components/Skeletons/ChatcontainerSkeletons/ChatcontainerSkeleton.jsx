export default function ChatcontainerSkeleton() {
    const NEW_ARRAY = new Array(10).fill("");
    return (
        <div className="flex flex-1 flex-col gap-3 px-4 overflow-auto">
            {NEW_ARRAY.map((_, index) => {
                return (
                    <div
                        key={index}
                        className={
                            index % 2
                                ? "w-1/2 h-16 rounded-lg bg-secondary-400 self-end animate-pulse"
                                : "w-1/2 h-16 bg-secondary-300 rounded-lg animate-pulse"
                        }
                    ></div>
                );
            })}
        </div>
    );
}
