import AnimationWrapper from "../common/page-animation"
import { Link, Navigate } from "react-router-dom"
import InputBox from "../components/input.component"
import googleIcon from "../imgs/google.png"
import { useContext, useRef } from "react"
import {Toaster,toast} from "react-hot-toast"
import axios from "axios"
import { storeInSession } from "../common/session"
import { UserContext } from "../App"

const UserAuthForm = ({ type }) => {


    let serverRoute = type=="Sign In"? "/signin":"/signup";

    let {userAuth:{access_token},setUserAuth} = useContext(UserContext)

    console.log(access_token);

    const userAuthThroughServer = (serverRoute,formData) =>{
        // console.log(formData);
        // console.log(import.meta.env.VITE_SERVER_DOMAIN + serverRoute)
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
        .then(({data})=>{
            // console.log(response);
            // console.log(response.data);
            // toast.error(response.data.error);
            toast.success("working");
            storeInSession("user",JSON.stringify(data));
            setUserAuth(data);
        })
        .catch((err) => {
            console.log(err);
            if (err.response && err.response.data) {
                toast.error(err.response.data.error);
            } else {
                toast.error("An unexpected error occurred");
            }
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        let form = new FormData(formElement);
        let formData = {};

        for(let [key,value] of form.entries()){
            formData[key] = value;
        }

        let {fullname,email,password} = formData;

        
        if(fullname){
            if(fullname.length<3){
                return toast.error("Fullname should be atleast 3 letters long");
            }
        }
        if(!email.length){
            return toast.error("Add email");
        }
        if(!emailRegex.test(email)){
            return toast.error("Email invalid");
        }
        if(!passwordRegex.test(password)){
            return toast.error("Password requirements not met")
        }
        userAuthThroughServer(serverRoute,formData);
    }

    return (
        // access_token ?
        // <Navigate to="/"/>
        // :
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <Toaster/>
                <form id = "formElement" className="w-[80%] max-w-[400px]">
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        {type == "Sign In" ? "Welcome Back" : "Join Us today"}
                    </h1>
                    {
                        type != "Sign In" ?
                            <InputBox
                                name="fullname"
                                type="text"
                                placeholder="Full Name"
                                icon="fi-rr-user"
                            />
                            : ""
                    }
                    <InputBox
                        name="email"
                        type="email"
                        placeholder="Email"
                        icon="fi-sr-envelope"
                    />
                    <InputBox
                        name="password"
                        type="password"
                        placeholder="Password"
                        icon="fi-br-lock"
                    />
                    <button className="btn-dark center mt-14" type="submit" onClick={handleSubmit}>
                        {type}
                    </button>
                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>or</p>
                        <hr className="w-1/2 border-black" />
                    </div>
                    <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
                        <img src={googleIcon} className="w-5" />
                        continue with google
                    </button>
                    {
                        type == "Sign In" ?
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                join us today?
                                <Link to="/signup" className="underline text-black text-xl ml-1">Sign up here</Link>
                            </p> :
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Already a member ?
                                <Link to="/signin" className="underline text-black text-xl ml-1">Sign in here</Link>
                            </p>
                    }
                </form>
            </section>
        </AnimationWrapper>
    )
}

export default UserAuthForm