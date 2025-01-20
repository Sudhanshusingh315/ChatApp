import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [login, setLogin] = useState(false);

    const navigate = useNavigate();
    const handleLogin = async () => {
        // todo : make the toast notficication here.
        // toddo: make the api request from redux store and not like this.
        // todo: remove unnecessary console logs.

        console.log("making api call for login");
        const {data} = await axios({
            method: "post",
            url: "/api/auth/login",
            data: {
                email,
                password,
            },
        });

        // todo: do the same in signup component.
        if(!data?.profileSetup){
            navigate('/profile');
        }
        else{
            navigate('/chat');
        }
        // todo: handle the token save.
    };

    const handleSignup = async () => {
        // toddo: make the api request from redux store and not like this.
        if (password !== confirmPassword) {
            // todo: make the toast notification here
            console.log("error password and confirm password is not the same");
            return;
        }
        console.log("making api call");
        const result = await axios({
            method: "post",
            url: "/api/auth/signup",
            data: {
                email,
                password,
            },
        });
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
        <div className="auth-container grid place-content-center min-h-dvh text-center">
            <div className="px-12 grid gap-6">
                <div className="grid gap-2">
                    <h1 className="text-4xl ">Welcome</h1>
                    <p>
                        fill in the details to get started with the best chat
                        application
                    </p>
                </div>
                {login ? (
                    <>
                        <div className="grid gap-4">
                            <input
                                placeholder="email"
                                className="p-2 rounded-md border-gray-400 border-2"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                type="email"
                            />
                            <input
                                placeholder="password"
                                className="p-2 rounded-md border-gray-400 border-2"
                                type="password"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                            <button
                                className="justify-self-center rounded-md text-accent px-7 py-2 bg-primary cursor-pointer"
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                        </div>
                        <p className="my-2">
                            Don't have an account?{" "}
                            <button
                                className="justify-self-center rounded-md text-accent px-4 py-1 bg-primary cursor-pointer"
                                onClick={handleSwitchAuthMethod}
                            >
                                Sign up
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <div className="grid gap-4">
                            <input
                                placeholder="email"
                                className="p-2 rounded-md border-gray-400 border-2"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                            <input
                                placeholder="password"
                                className="p-2 rounded-md border-gray-400 border-2"
                                type="password"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                            <input
                                placeholder="confirm password"
                                className="p-2 rounded-md border-gray-400 border-2"
                                type="password"
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                }}
                            />
                            <button
                                className="justify-self-center rounded-md text-accent px-7 py-2 bg-primary cursor-pointer "
                                onClick={handleSignup}
                            >
                                Sign Up
                            </button>
                        </div>
                        <p className="my-2">
                            Already have an account?{" "}
                            <button
                                className="justify-self-center rounded-md text-accent px-4 py-1 bg-primary cursor-pointer"
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
