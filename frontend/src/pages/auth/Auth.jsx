import { useState } from "react";
import { Link } from "react-router-dom";

export default function Auth() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [login, useSignIn] = useState(false); 
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
                {/* login component */}
                {login ?<>
                 <div className="grid gap-4">
                    <input placeholder="username" className="p-2 rounded-md border-gray-400 border-2"/>
                    <input placeholder="password" className="p-2 rounded-md border-gray-400 border-2"/>
                    <button className="justify-self-center rounded-md text-accent px-7 py-2 bg-primary cursor-pointer">Login</button>
                </div>
                <p className="my-2">Don't have an account? <button className="justify-self-center rounded-md text-accent px-4 py-1 bg-primary cursor-pointer">Sign up</button></p>
</>
            :
            <>
                 <div className="grid gap-4">
                    <input placeholder="username" className="p-2 rounded-md border-gray-400 border-2"/>
                    <input placeholder="password" className="p-2 rounded-md border-gray-400 border-2"/>
                    <input placeholder="confirm password" className="p-2 rounded-md border-gray-400 border-2"/>
                    <button className="justify-self-center rounded-md text-accent px-7 py-2 bg-primary cursor-pointer">Sign Up</button>
                </div>
                <p className="my-2">Already have an account? <button className="justify-self-center rounded-md text-accent px-4 py-1 bg-primary cursor-pointer">Login</button></p>
            </>
            }
            </div>
        </div>
    );
}
