import "./login.scss";

import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { makeRequest } from "../../utils/axios";
import DOMPurify from 'dompurify';
import validator from 'validator';
import { useEffect } from "react";



const Login = () => {
  const { login } = useContext(AuthContext);
  const [showSignUp, setShowSignUp] = useState(false);
  const [loginInputs, setLoginInputs] = useState({
    username: "",
    password: "",
  });
  const [signupInputs, setSignupInputs] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState(null);
  // ***Input validation***
  const validateUsername = (e) => {
    let userName = e.target.value.trim();
    // Sanitize the input using DOMPurify
    userName = DOMPurify.sanitize(userName);
    // Remove any characters that don't match the regex
    userName = userName.replace(/[^a-zA-Z0-9]/g, "");
    setSignupInputs(prev => ({...prev, username:userName}))
    console.log(userName);
    if(!validator.isAlphanumeric(userName) || !validator.isLength(userName, { min: 3, max: 16 })){
      setError("Invalid Username, Minimum 3 and Maximum 16 alphanumeric characters are allowed");
    } else {
      setError("");
    }  
  }
  
  const handleSignupFirstName = (e) => {
    let firstname = e.target.value.trim();
    // Sanitize the input using DOMPurify
    firstname = DOMPurify.sanitize(firstname);
    // Remove any characters that don't match the regex
    firstname = firstname.replace(/[^a-zA-Z]/g, "");
    setSignupInputs(prev => ({...prev, firstName: firstname}))
    if(!validator.isAlpha(firstname) || !validator.isLength(firstname, { min: 3, max: 16 })){
      setError("Invalid First name,Please use only alphabets with minimum 3 and maximum 16 characters");
    } else{
      setError("");
    }
  };
  const handleSignupLastName = (e) => {
    let lastname= e.target.value.trim();
    // Sanitize the input using DOMPurify
    lastname = DOMPurify.sanitize(lastname);
    // Remove any characters that don't match the regex
    lastname = lastname.replace(/[^a-zA-Z]/g, "");
    setSignupInputs(prev => ({...prev, lastName: lastname}))
    if(!validator.isAlpha(lastname) || !validator.isLength(lastname, { min: 3, max: 16 })){ 
      setError("Invalid Last name,Please use only alphabets with minimum 3 and maximum 16 characters");  
    } else{
      setError("");
    }
  };
  const handleSignupPassword = (e) => {
    let passWord= e.target.value.trim();
    // Sanitize the input using DOMPurify
    passWord = DOMPurify.sanitize(passWord);
    setSignupInputs(prev => ({...prev, password: passWord}))
    if(!validator.isStrongPassword(passWord, { 
        minLength: 8, 
        minLowercase: 1, 
        minUppercase: 1, 
        minNumbers: 1, 
        minSymbols: 1 
      })){
      setError("Password must have at least 1 uppercase, 1 lowercase, a number, and 1 special character. It must be at least 8 characters long.");         
    } else{
      setError("");
    }
  };

     const handleSignupConfirmPassword = (e) => {
  let confirmpassWord= e.target.value.trim();
  // Sanitize the input using DOMPurify
  confirmpassWord = DOMPurify.sanitize(confirmpassWord);
  setSignupInputs(prev => ({...prev, confirm_password: confirmpassWord}))
  if(!validator.equals(confirmpassWord, signupInputs.password)){
    setError("Passwords do not match");
  } else if(!validator.isStrongPassword(confirmpassWord, { 
      minLength: 8, 
      minLowercase: 1, 
        minUppercase: 1, 
        minNumbers: 1, 
        minSymbols: 1 
      })){
      setError("Password must have at least 1 uppercase, 1 lowercase, a number, and 1 special character. It must be at least 8 characters long.");         
    } else{
      setError("");
    }
  };

  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  useEffect(() => {
    // Generate a new CAPTCHA string when the webpage is mounted
    const newCaptcha = createCaptcha();
    setCaptcha(newCaptcha);
  }, []);;
  const createCaptcha = () => {
    const length = 6;
    const charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let captcha = "";
  
    for (let i = 0; i < length; i++) {
      //crate a random string of string and number
      const randomIndex = Math.floor(Math.random() * charset.length); 
      captcha += charset[randomIndex];
    }
    return captcha;
  }
  const handleRefreshCaptcha = (e) => {
    e.preventDefault();
    const captcha = createCaptcha();
    setCaptcha(captcha);
  }
  const handleLoginInputChange = (e) => {
    setLoginInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  const handleCaptchaInputChange = (e) => {
    setCaptchaInput(e.target.value);
  }
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (captcha === captchaInput) {
      await login({ ...loginInputs });
    } else {
      toast.error("Invalid captcha!");
    }
  };
 
  const handleSignup = async (e) => {
    try {
      e.preventDefault();
      const res = await makeRequest.post("/users/create-user", {
        ...signupInputs,
      });
      if (res.data.success) {
        setSignupInputs({
          username: "",
          firstName: "",
          lastName: "",
          password: "",
          confirm_password: "",
        });
        setShowSignUp(false);
        toast.success(res.data.message || "User created successfully.");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message || "Something went wrong!");
    }
  };

  return (
    <ContentWrapper>
      <div className="login">
        <h1>Daily Post Login</h1>
        <p>
          Login or{" "}
          <span id="signup-button" onClick={() => setShowSignUp(true)}>
            signup
          </span>{" "}
          to continue
        </p>
        <div id="login-container">
          <form onSubmit={handleLogin}>
            <p className="input-detail">Enter Username:</p>
            <input
              type="text"
              name="username"
              placeholder="Your Username"
              required
              onChange={handleLoginInputChange}
              value={loginInputs.username}
            />
            <p className="input-detail">Enter Password:</p>
            <input
              type="password"
              name="password"
              placeholder="Your Password"
              required
              onChange={handleLoginInputChange}
              value={loginInputs.password}
            />
            <p className="input-detail">Enter Captcha:</p>
            <div className="captcha">
              <input
                type="text"
                name="captcha"
                placeholder="Enter Captcha"
                required
                onChange={handleCaptchaInputChange}
                value={captchaInput}
              />
              <input type="text" value={captcha} readOnly disabled/>
               <button type="button" className="refresh-captcha" onClick={handleRefreshCaptcha}>
                Refresh Captcha
              </button> 
            </div>
       
            <button className="submit-button" >Login </button>
          </form>
        </div>

        {showSignUp && (
          <div id="signup-container">
            <div id="signup-form">
              <span id="close" onClick={() => setShowSignUp(false)}>
                ✖
              </span>
              <h1>
                Join the
                <span style={{ color: "rgba(0, 0, 255, 0.445)" }}>
                  {" "}
                  Daily Post{" "}
                </span>
                community!
              </h1>
              {error && <p>{error}</p>}
              <form onSubmit={handleSignup}>
                <p className="input-detail">Username:</p>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                  required
                  onChange={validateUsername}
                  //onChange={handleSignupInputChange}
                  
                  value={signupInputs.username}
                />
                <p className="input-detail">First Name:</p>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                  onChange={handleSignupFirstName}
                  //onChange={handleSignupInputChange}
                  value={signupInputs.firstName}
                />
                <p className="input-detail">Last Name:</p>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  onChange={handleSignupLastName}
                  //onChange={handleSignupInputChange}
                  value={signupInputs.lastName}
                />

                <p className="input-detail">Enter Password:</p>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  maxLength="16"
                  required
                  onChange={handleSignupPassword}
                  //onChange={handleSignupInputChange}
                  value={signupInputs.password}
                />
                <p className="input-detail">Confirm Password:</p>
                <input
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm Password"
                  required
                  onChange={handleSignupConfirmPassword}
                  value={signupInputs.confirm_password}
                />
                <button className="submit-button">Signup</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </ContentWrapper>
  );
};

export default Login;
