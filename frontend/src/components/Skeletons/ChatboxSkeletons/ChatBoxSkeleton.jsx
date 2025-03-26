import "./styles.css";
let NEW_ARRAY = new Array(4).fill("");
export default function ChatBoxSkeleton() {
    return (
        <div>
            {NEW_ARRAY?.map((_, index) => {
                return (
                    <div key={index} className="parent-dummy-box">
                        <div className="message-box-dummy animate-pulse"></div>
                        <div className="grid gap-1 ">
                            <p className="name-dummy animate-pulse"></p>
                            <p className="message-dummy animate-pulse"></p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="date-dummy animate-pulse"></p>
                            <p className="new-message-dummy animate-pulse"></p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
