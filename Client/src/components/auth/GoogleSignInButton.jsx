import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import DataContext from "../../context/DataContext";
import ThemeContext from "../../context/ThemeContext";
import styles from "./GoogleSignInButton.module.css";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function GoogleSignInButton({ onError }) {
  const { setUser } = useContext(DataContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!CLIENT_ID) return;

    let cancelled = false;
    let pollTimer = null;

    const handleCredentialResponse = async (response) => {
      try {
        const res = await axios.post(
          "/api/v1/auth/google",
          { credential: response.credential },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setUser({
          username: res.data.username,
          accessToken: res.data.accessToken,
        });
        navigate(`/profile/${res.data.username}`);
      } catch (error) {
        console.debug(error.message);
        if (onError) onError("Google sign-in failed. Please try again.");
      }
    };

    const tryInit = () => {
      if (cancelled) return;

      if (window.google?.accounts?.id && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredentialResponse,
        });
        buttonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: theme === "dark" ? "filled_black" : "outline",
          size: "large",
          shape: "rectangular",
          text: "continue_with",
          logo_alignment: "left",
          width: Math.min(buttonRef.current.clientWidth || 340, 380),
        });
      } else {
        pollTimer = setTimeout(tryInit, 100);
      }
    };

    tryInit();

    return () => {
      cancelled = true;
      if (pollTimer) clearTimeout(pollTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  if (!CLIENT_ID) return null;

  return (
    <div className={styles.wrapper}>
      <div ref={buttonRef} className={styles.buttonSlot} />
    </div>
  );
}

export default GoogleSignInButton;
