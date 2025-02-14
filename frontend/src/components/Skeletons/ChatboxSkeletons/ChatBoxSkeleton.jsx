import "./styles.css";
let NEW_ARRAY = new Array(4).fill("");
export default function ChatBoxSkeleton() {
    return (
        <div>
            {NEW_ARRAY?.map((_, index) => {
                return (
                    <div
                        key={index}
                        className="flex gap-1 px-4 py-3 bg-primary/60 bg-pink-600 "
                    >
                        <div className=" rounded-full min-w-4 w-14 h-14 bg-secondary-400 animate-pulse"></div>
                        <div className="grid gap-1 flex-1">
                            <p className="bg-secondary-400 rounded-lg w-40 h-6 animate-pulse"></p>
                            <p className="bg-secondary-400 rounded-lg w-60 h-6 animate-pulse"></p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="bg-secondary-400 rounded-lg  min-w-4 w-20 h-6 animate-pulse"></p>
                            <p className="bg-secondary-400 rounded-full w-4 h-4 self-end animate-pulse"></p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
