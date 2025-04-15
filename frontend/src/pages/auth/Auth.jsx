import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { authLogin } from "../../features/auth/authSlice";
import { configEnv } from "../../constants/contants";

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [login, setLogin] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGuestUserOne = async () => {
        // only for login
        let email = import.meta.env.VITE_USER1_EMAIL;
        let password = import.meta.env.VITE_USER1_PASSWORD;
        const response = await dispatch(authLogin({ email, password }));
        console.log("response login", response);
        if (!response?.payload?.profileSetup) {
            // todo: do the profile setup ui
            navigate("/profile");
        } else {
            console.log("navigate to chat");
            navigate("/");
        }
    };
    console.log("config base url",configEnv.BASE_URL);
    const handleGuestUserTwo = async () => {
        // only for login
        let email = import.meta.env.VITE_USER2_EMAIL;
        let password = import.meta.env.VITE_USER2_PASSWORD;
        const response = await dispatch(authLogin({ email, password }));
        console.log("response login", response);
        if (!response?.payload?.profileSetup) {
            // todo: do the profile setup ui
            navigate("/profile");
        } else {
            console.log("navigate to chat");
            navigate("/");
        }
    };

    const handleLogin = async () => {
        // todo : make the toast notficication here.
        // todo: remove unnecessary console logs.
        // todo: Enter makes the user login

        const response = await dispatch(authLogin({ email, password }));
        console.log("response login", response);
        if (!response?.payload?.profileSetup) {
            // todo: do the profile setup ui
            navigate("/profile");
        } else {
            console.log("navigate to chat");
            navigate("/");
        }
    };

    const handleSignup = async () => {
        // todo: make the singup reducer work, handle the edge case, should do as soon as possible but i have got other things to implement as well so!!!!
        // todo: Enter makes the user signup
        if (password !== confirmPassword) {
            // todo: make the toast notification here
            console.log("error password and confirm password is not the same");
            return;
        }
        const response = dispatch();
        console.log(result);
    };

    const handleSwitchAuthMethod = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setProfileImage("");
        setLogin((prev) => !prev);
    };
    return (
        <div className="auth-container grid place-content-center text-white min-h-dvh text-center">
            <div className="px-12 grid gap-6">
                <div className="grid gap-2">
                    <h1 className="text-4xl font-semibold uppercase">
                        Welcome
                    </h1>
                    <p>
                        fill in the details to get started with the best chat
                        application
                    </p>
                </div>
                {login ? (
                    <>
                        <div className="grid gap-4 bg-pink-700 px-8 py-4 rounded-lg">
                            <input
                                placeholder="email"
                                className="p-2 rounded-md border-gray-400 border-2 uppercase placeholder:font-bold "
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                type="email"
                            />
                            <input
                                placeholder="password"
                                className="p-2 rounded-md border-gray-400 border-2 uppercase placeholder:font-bold"
                                type="password"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                            <button
                                className="justify-self-center rounded-md text-accent font-bold  text-xl outline-none px-8 py-4 bg-primary cursor-pointer"
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                            <button
                                className="justify-self-center rounded-md text-accent font-bold  text-xl outline-none px-8 py-4 bg-primary cursor-pointer"
                                onClick={handleGuestUserOne}
                            >
                                Guest User 1
                            </button>
                            <button
                                className="justify-self-center rounded-md text-accent font-bold  text-xl outline-none px-8 py-4 bg-primary cursor-pointer"
                                onClick={handleGuestUserTwo}
                            >
                                Guest User 2
                            </button>
                        </div>
                        <p className="my-2 text-white">
                            Don't have an account?{" "}
                            <button
                                className="justify-self-center rounded-md  outline-none text-accent px-4 text-xl py-2 bg-primary cursor-pointer"
                                onClick={handleSwitchAuthMethod}
                            >
                                Sign up
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <div className="grid gap-4 bg-pink-700 px-8 py-4 rounded-lg">
                            <input
                                placeholder="email"
                                className="p-2 rounded-md border-gray-400 border-2 uppercase placeholder:font-bold "
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                            <input
                                placeholder="password"
                                className="p-2 rounded-md border-gray-400 border-2 uppercase placeholder:font-bold "
                                type="password"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                            <input
                                placeholder="confirm password"
                                className="p-2 rounded-md border-gray-400 border-2 uppercase placeholder:font-bold "
                                type="password"
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                }}
                            />
                            <button
                                onClick={handleSignup}
                                className="justify-self-center rounded-md text-accent font-bold  text-xl outline-none px-8 py-4 bg-primary cursor-pointer"
                            >
                                Sign Up
                            </button>
                            <button
                                className="justify-self-center rounded-md text-accent font-bold  text-xl outline-none px-8 py-4 bg-primary cursor-pointer"
                                onClick={handleGuestUserOne}
                            >
                                Guest User 1
                            </button>
                            <button
                                className="justify-self-center rounded-md text-accent font-bold  text-xl outline-none px-8 py-4 bg-primary cursor-pointer"
                                onClick={handleGuestUserTwo}
                            >
                                Guest User 2
                            </button>
                        </div>
                        <p className="my-2">
                            Already have an account?{" "}
                            <button
                                className="justify-self-center rounded-md  outline-none text-accent px-4 text-xl py-2 bg-primary cursor-pointer"
                                onClick={handleSwitchAuthMethod}
                            >
                                Login
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
