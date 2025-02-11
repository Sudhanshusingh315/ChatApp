import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../utils/firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { authProfileSetup } from "../../features/auth/authSlice";
import { IoIosCloudUpload } from "react-icons/io";
export default function Profile() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [profileImageComplete, setProfileImageComplete] = useState(false);
    const [isProfileSetup, setIsProfileSetup] = useState(false);
    const profileImageRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    // todo: add api call to redux
    const handleProfileSetup = (e) => {
        e.stopPropagation();
        if (!isProfileSetup) {
            setIsProfileSetup(true);
        }
        profileImageRef.current.click();
    };
    const handleuploadProfileToFireBase = (e) => {
        console.log("files in upload section");
        if (!e.target.files) return;
        console.log(e.target.files);
        const file = e.target?.files[0];
        const storageRef = ref(storage, `profile/${file.name}`);
        console.log("storage ref is ", storageRef);

        uploadFileToFireBase(storageRef, file);
    };
    console.log("userInfo",userInfo);
    console.log("firstName", firstName);
    console.log("lastName", lastName);
    console.log("profile image", profileImage);
    const uploadFileToFireBase = (storageRef, file, fileFormat) => {
        console.log("uploading file to fireBase");
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                console.log("bytesTransferred", snapshot.bytesTransferred);
                console.log("totlaBytes", snapshot.totalBytes);
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

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
                setProfileImage(fileFromFireBase);
                setProfileImageComplete(true);
            }
        );
    };

    const handleProfileUpdate = () => {
        const profileSetupInfo = {
            firstName,
            lastName,
            profileImage,
            userId: userInfo?.userId,
        };
        dispatch(authProfileSetup(profileSetupInfo));
    };
    return (
        <>
            <input
                ref={profileImageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleuploadProfileToFireBase}
            />
            <div className="profile-section">
                {/* todo: add image profile section here as well. */}
                {!isProfileSetup ? (
                    <img
                        className="image-itself"
                        src={
                            "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?t=st=1739202662~exp=1739206262~hmac=da749b342d7664ea9d3b4d1513db025fde0657e9a157f657a7c51da8cdb9db60&w=826"
                        }
                        alt=""
                        onClick={handleProfileSetup}
                    />
                ) : !profileImage ? (
                    <div className="dummy-profile animate-pulse">
                        <IoIosCloudUpload />
                    </div>
                ) : (
                    <img
                        className={"image-itself"}
                        src={profileImage ? profileImage : ""}
                        alt=""
                        onClick={handleProfileSetup}
                    />
                )}
                <div className="profile-section-details">
                    <input
                        type="text"
                        placeholder="First-name"
                        className=""
                        value={firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value);
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Last-name"
                        className=""
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value);
                        }}
                    />
                    <button
                        className="bg-primary text-secondary-300 hover:bg-primary-bg hover:text-secondary-400"
                        onClick={handleProfileUpdate}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    );
}
