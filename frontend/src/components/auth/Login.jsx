import React, { useState } from "react";
import Input from "../common/Input.jsx";
import validator from "validator";
import {useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {clearError,setError,setLoading,setUser,} from "../../redux/slices/authSlice.js";
import {closeAuthModal, switchAuthMode} from "../../redux/slices/uiSlice.js";
import "../../css/auth/Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [forgotEmail, setForgotEmail]= useState("");
    const [forgotMsg, setFotgotMsg]= useState("");
    const dispatch = useDispatch();
    const {isLoading, error}= useSelector((state)=> state.auth);
    const{authMode}= useSelector((state)=>state.ui);
    const isForgot = authMode === "forgot";
    const handleLogin= async (e)=> {
        e.preventDefault();
        dispatch(clearError());
        if (!validator.isEmail(email)) {
            dispatch(setError("Please enter a valid email address"));
            return;
        }
        if (!password) {
            dispatch(setError("Please enter your password"));
            return;
        }
        dispatch(setLoading(true));
        try {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`,{
        email,
        password,
        });
        const data =res.data || {};
        dispatch(
            setUser({
            user: data.user,
            token: data.token,
            })
        );
        localStorage.setItem("token", data.token);
        dispatch(closeAuthModal());
        console.log("Login Successfull");
        }catch (error){
            const serverMessage =
            error?.response?.data?.message || error?.response?.data?.error;
            dispatch(setError(serverMessage || "Login Failed "));
        }
    };
    const handleForgotPassword = async()=>{
        if(!forgotEmail){
            setForgotEmail("Please enter your email");
            return;
        }
        try {
            setFotgotMsg("Sending reset link..");
            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/forgot-password`,{email: forgotEmail},);
            setFotgotMsg("Reset link sent! Check your mail");
        } catch (error) {
            setFotgotMsg(
                error?.response?.data?.message || "Failed to send the reset mail",
            );
        }
    };
    return (
        <div className="login-wrapper">
            <h3 className="login-title">Welcome Back</h3>
            <p className="login-subtitle">Please enter your details to login</p>
            <form className="login-form" onSubmit={handleLogin}>
                    {!isForgot && (
                        <>
                        <Input
                        value={email}
                        onChange={(e) =>{
                        setEmail(e.target.value);
                        }}
                        label={"Email Address"}
                        placeholder={"jhondoe@email.com"}
                        type="email"
                    />
                    <Input
                        value={password}
                        onChange={(e) =>{
                        setPassword(e.target.value);
                        }}
                        label={"Password"}
                        placeholder={"123456"}
                        type="password"
                    />
                        </>
                    )}
                    <div className="forgot-wrapper">
                        {!isForgot? (
                            <>
                            <span className="forgot-link" onClick={()=>
                            {
                                dispatch(clearError());
                                dispatch(switchAuthMode("forgot"))
                            }}>
                                Forgot Password?
                            </span>
                            <span className="forgot-link" onClick={()=>
                            {
                                dispatch(clearError())
                                dispatch(switchAuthMode("signup"))
                            }}>Don't have an account? Sign up</span>
                            </>
                        ):(
                            <div className="forgot-box">
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="Enter your registered email"
                                    value={forgotEmail}
                                    onChange={(e) =>setForgotEmail(e.target.value)}
                                />
                                {forgotMsg && <p className="forgot-msg">
                                {forgotMsg}</p>}
                                <button
                                    type="button"
                                    className="Forgot-btn"
                                    onClick={handleForgotPassword}
                                >
                                    Send the Reset link
                                </button>
                            </div>
                        )}
                     </div>          
                    {error && <div className="login-error">{error}</div>}
                    {!isForgot && (
                        <button
                            type="submit"
                            className="Login-submit-btn"
                            disabled={isLoading}
                            >
                            <span>{isLoading? "Logging in...": "Login"}
                            </span>
                        </button>
                    )}
            </form>
        </div>
    );
};
export default Login;