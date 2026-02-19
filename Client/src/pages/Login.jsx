import { useContext, useEffect, useRef, useState } from "react";
import styles from "./Register.module.css";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import DataContext from "../context/DataContext";
import { motion } from "framer-motion";

const loginVariants = {
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

function Login() {
  const { setUser } = useContext(DataContext);

  const userRef = useRef();
  const navigate = useNavigate();

  const LOGIN_URL = "/api/v1/login";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const eyePath =
    "M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z";
  const eyeSlashPath =
    "M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username, password }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setUser({
        username: response.data.username,
        accessToken: response.data.accessToken,
      });
      setSuccess(true);
      setErr("");
      navigate(`/profile/${response.data.username}`);
    } catch (error) {
      console.debug(error.message);
      if (!error.response) setErr("No response from server");
      else if (error.response.status === 401) setErr("Incorrect username or password");
      else setErr("Login Failed");
    }
  };

  return (
    <div className={styles.registerPage}>
      <motion.form variants={loginVariants} initial="hidden" animate="visible" onSubmit={handleSubmit} className={styles.container}>
        {err ? <p className={styles.errorMessage}>{err}</p> : null}
        <h1 className={styles.title}>Login</h1>
        
        {success ? (
          <div></div>
        ) : (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>
                Username:
              </label>
              <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password:
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPwd ? "text" : "password"}
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className={styles.eyeButton}
                >
                  {showPwd ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                      <path d={eyePath} />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                      <path d={eyeSlashPath} />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className={styles.button}
              disabled={!username || !password}
            >
              Sign in
            </button>
            <p className={styles.registerOption}>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </>
        )}
      </motion.form>
    </div>
  );
}

export default Login;