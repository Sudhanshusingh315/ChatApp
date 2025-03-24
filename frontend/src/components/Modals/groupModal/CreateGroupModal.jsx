import { useEffect, useRef, useState } from "react";
import "./createGroupModal.css";
import { RxCross2 } from "react-icons/rx";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../utils/firebase/firebase";
import { createGroup } from "../../../api/chat.api";
export default function CreateGroupModal({
    open,
    onClose,
    handleGroupCreation,
    groupCreation,
    userInfo,
}) {
    const [groupImage, setGroupImage] = useState("");
    const [groupName, setGroupName] = useState("");
    const [groupSectionAbout, setGroupSectionAbout] = useState("");
    const groupProfileImageRef = useRef(null);
    const [groupProfileImagePresent, setGroupProfileImagePresent] =
        useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [finalGroupParticipants, setFinalGroupParticipants] =
        useState(groupCreation);

    useEffect(() => {
        if (!groupCreation) return;
        setFinalGroupParticipants(groupCreation);
    }, [groupCreation]);

    const goBack = (e) => {
        e.stopPropagation();
        onClose(!open);
        setGroupImage("");
        setGroupName("");
        setGroupSectionAbout("");
        groupProfileImageRef.current = null;
        setGroupProfileImagePresent(null);
        setIsUploading(false);
    };
    const handleGroupImageInputRef = (e) => {
        e.stopPropagation();
        if (!groupProfileImageRef.current) return;

        groupProfileImageRef.current.click();
    };
    const handleUploadGroupImagesToFireBase = (e) => {
        console.log("image", e.target.files);
        if (!e.target.files) return;
        const file = e.target?.files[0];
        const storageRef = ref(storage, `groupProfile/${file.name}`);
        console.log("storage ref is ", storageRef);

        uploadFileToFireBase(storageRef, file);
    };
    const uploadFileToFireBase = (storageRef, file, fileFormat) => {
        console.log("uploading file to fireBase");
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                console.log("bytesTransferred", snapshot.bytesTransferred);
                console.log("totlaBytes", snapshot.totalBytes);
                const progress = Math.floor(
                    Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    )
                );
                console.log("progress", progress);
                progress === 100 ? setIsUploading(false) : setIsUploading(true);

                switch (snapshot.state) {
                    case "paused":
                        break;
                    case "running":
                        break;
                }
            },
            (error) => {
                switch (error.code) {
                    case "storage/unauthorized":
                        // User doesn't have permission to access the object
                        break;
                    case "storage/canceled":
                        // User canceled the upload
                        break;

                    // ...

                    case "storage/unknown":
                        break;
                }
            },
            async () => {
                const fileFromFireBase = await getDownloadURL(
                    uploadTask.snapshot.ref
                );
                setGroupImage(fileFromFireBase);
                setGroupProfileImagePresent(true);
            }
        );
    };
    const handleFormGroup = async () => {
        const result = await createGroup(
            groupCreation,
            groupName,
            groupSectionAbout,
            userInfo?.userId
        );
        setGroupName("");
        console.log("result ", result);
    };

    const removeFromFinalGroupCreation = (e, participantIndex) => {
        e.stopPropagation();
        setFinalGroupParticipants((prev) =>
            prev?.filter((_, index) => index !== participantIndex)
        );
    };
    console.log(finalGroupParticipants);
    return (
        <div
            className="group-backdrop"
            style={{
                transform: !open ? "translateX(-110%)" : "translateX(0%)",
            }}
        >
            <p className="cancle-group-creation" onClick={goBack}>
                <RxCross2 />
            </p>

            {/* input for upload profile image */}
            <input
                ref={groupProfileImageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadGroupImagesToFireBase}
            />

            {/* {!groupProfileImagePresent ? (
                <img
                    className="group-default-image"
                    src="https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                    alt=""
                />
            ) : (
                <img
                    className="group-profile-image"
                    src="https://images.ctfassets.net/ub3bwfd53mwy/5WFv6lEUb1e6kWeP06CLXr/acd328417f24786af98b1750d90813de/4_Image.jpg?w=750"
                    alt=""
                />
            )} */}

            {isUploading ? (
                <div className="uploading-image animate-pulse"></div>
            ) : (
                <img
                    className={
                        !groupProfileImagePresent
                            ? "group-default-image"
                            : "group-profile-image"
                    }
                    src={
                        !groupProfileImagePresent
                            ? "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                            : groupImage
                    }
                    alt="meow"
                    onClick={handleGroupImageInputRef}
                />
            )}

            <input
                className="group-name"
                type="text"
                placeholder="Group name"
                value={groupName}
                onChange={() => {
                    setGroupName(e.target.value);
                }}
            />
            <textarea
                className="group-section"
                type="text"
                placeholder="About"
                value={groupSectionAbout}
                onChange={() => {
                    setGroupSectionAbout(e.target.value);
                }}
            />
            {/* group participants */}

            <div className="final-group-data">
                {finalGroupParticipants?.map(
                    ({ profileImage, firstName }, index) => {
                        return (
                            <div
                                className="final-group-participants"
                                onClick={(e) => {
                                    removeFromFinalGroupCreation(e, index);
                                }}
                            >
                                <img src={profileImage} alt="" />
                                <p>{firstName}</p>
                            </div>
                        );
                    }
                )}
            </div>
            <button className="create-a-group" onClick={handleFormGroup}>
                Create A Group
            </button>
        </div>
    );
}
