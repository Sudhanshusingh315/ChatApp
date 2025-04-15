import axios from "axios";
import { useEffect, useState } from "react";
import { configEnv, messageTypes } from "../../constants/contants";
import pdfImage from "../../assets/pdf-svgrepo-com.svg";
import contactImage from "../../assets/contact2-svgrepo-com.svg";
export default function SectionDetails({ selectedChat, userInfo }) {
    const [media, setMedia] = useState();
    const result = {
        recipientId: selectedChat?._id,
        senderId: userInfo?.userId,
    };

    console.log("media", media);

    useEffect(() => {
        (async () => {
            const {
                data: { data },
            } = await axios({
                url: `${configEnv.BASE_URL}/api/messages/getAllMedia`,
                method: "post",
                data: result,
            });
            setMedia(data);
        })();
    }, []);

    const renderWhat = (data) => {
        const { messageType, imageWithText } = data;
        switch (messageType) {
            case messageTypes.IMAGEWITHTEXT:
                return (
                    <img
                        src={imageWithText[0]?.image}
                        alt=""
                        className="media-section-image"
                    />
                );
                break;
            case messageTypes.PDFWITHTEXT:
                return <img src={pdfImage} className="media-section-image" />;
                break;
            case messageTypes.CONTACT:
                return (
                    <img src={contactImage} className="media-section-image" />
                );
                break;
            default:
                break;
        }
    };
    return (
        <>
            <div>
                <h1 className="media-section-title">Chat Media</h1>
                <div className="media-section-container">
                    {media?.length > 0 ? (
                        media.map((data, index) => {
                            return (
                                <div key={index} className="box-test">
                                    {renderWhat(data)}
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-media-here">
                            no shared media yet.
                            <div className="text-lg lowercase">
                                womp wompppp!!!😞
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
