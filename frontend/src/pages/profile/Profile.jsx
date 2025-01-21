import axios from "axios";
import { useState } from "react"
import {useNavigate} from 'react-router-dom'
export default function Profile(){
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();     
    // todo: add api call to redux
    const handleProfileSetup =()=>{
        // todo: finish the api

        // const response = axios({
        //     method:'post',
        //     url:'api/update/' 
        // })

        // todo: if response is successful, update the input fields here.

        navigate('/chat')
    }
    return <div>
        {/* todo: add image profile section here as well. */}
       <input placeholder="username name" className="px-4 py-2 border-2 border-red-400 border-solid"/> 
       <input placeholder="first name" className="px-4 py-2 border-2 border-red-400 border-solid"/> 
       <input placeholder="last name" className="px-4 py-2 border-2 border-red-400 border-solid"/> 
       {/* todo: pre avatar or select your profile or  */}
       <button onClick={handleProfileSetup} className="bg-cyan-400 px-4 py-2 ">save changes</button> 
    </div>
}