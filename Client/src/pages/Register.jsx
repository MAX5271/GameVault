import { useEffect, useRef, useState } from "react";
import styles from "./Register.module.css";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import {motion} from "framer-motion"

const USER_REGEX = /^[A-z][A-z0-9-_]{2,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const registerVariants = {
  hidden:{
    opacity:0,
    scale:0.6
  },
  visible:{
    opacity:1,
    scale:1,
    transition:{
      type:"spring",
      duration:0.1,
      stiffness:300,
      damping:15
    }
  }
}

function Register() {
  const userRef = useRef();
  const navigate = useNavigate();
  const REGISTER_URL = "/api/v1/register";

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPass, setValidPass] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [showPwd, setShowPwd] = useState(false);
  const [showMatch, setShowMatch] = useState(false);

  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPass(PWD_REGEX.test(password));
    setValidMatch(password === matchPwd);
  }, [matchPwd, password]);

  const eyePath = "M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z";
  const eyeSlashPath = "M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!USER_REGEX.test(username) || !PWD_REGEX.test(password)) {
      console.debug("Invalid entry");
      return;
    }

    try {
      await axios.post(
        REGISTER_URL,
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setSuccess(true);
      setErr('');
    } catch (error) {
      if(!error.response) setErr("No response from server");
      else if(error.response.status===409) setErr("Username already taken");
      else setErr('Registration failed');
    }
  };

  return (
    <div className={styles.registerPage}>
      <motion.form variants={registerVariants} initial="hidden" animate="visible" onSubmit={handleSubmit} className={styles.container}>
        {err ? <p className={styles.errorMessage}>{err}</p> : null}
        <h1 className={styles.title}>Register</h1>
        <>
          {success ? (
            <button
              onClick={(e) => {e.preventDefault(); navigate("/login");}}
              className={styles.loginButton}
            >
              Continue to Login
            </button>
          ) : (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>Username:</label>
                <input
                  type="text"
                  id="username"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  required
                  className={styles.input}
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                />
                <p className={username && userFocus && !validUsername ? styles.instructions : styles.offscreen}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12px" height="12px">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  3 to 24 characters.<br />
                  Must begin with a letter.<br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>Password:</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPwd ? "text" : "password"}
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    className={styles.input}
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className={styles.eyeButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox={showPwd ? "0 0 576 512" : "0 0 640 512"}>
                       <path d={showPwd ? eyePath : eyeSlashPath} />
                    </svg>
                  </button>
                </div>
                <p className={pwdFocus && !validPass ? styles.instructions : styles.offscreen}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12px" height="12px">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  8 to 24 characters.<br />
                  Must include uppercase and lowercase letters, a number and a special character.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cnfpwd" className={styles.label}>Confirm Password:</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showMatch ? "text" : "password"}
                    id="cnfpwd"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    required
                    className={styles.input}
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                  />
                  <button type="button" onClick={() => setShowMatch(!showMatch)} className={styles.eyeButton}>
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox={showMatch ? "0 0 576 512" : "0 0 640 512"}>
                       <path d={showMatch ? eyePath : eyeSlashPath} />
                    </svg>
                  </button>
                </div>
                <p className={matchFocus && !validMatch ? styles.instructions : styles.offscreen}>
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12px" height="12px">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  Passwords in both fields should be same
                </p>
              </div>

              <button type="submit" className={styles.button} disabled={!validMatch || !validUsername || !validPass}>
                Sign Up
              </button>

              <div className={styles.loginRedirect}>
                <span className={styles.loginLinkText}>Already have an account?</span>
                <button 
                  className={styles.loginRedirectButton}
                  onClick={(e) => { e.preventDefault(); navigate('/login'); }}
                >
                  Sign In
                </button>
              </div>
            </>
          )}
        </>
      </motion.form>
    </div>
  );
}

export default Register;