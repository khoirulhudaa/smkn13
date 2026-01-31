import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { useEffect } from "react";

export const Logout = () => {
  const auth = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    auth.logout();
    // localStorage.removeItem('token');
    localStorage.removeItem('hasShownSchoolDialog');
    localStorage.removeItem('qrCodeData');
    localStorage.removeItem('qrGeneratedDate');
    localStorage.removeItem('audioSummary');
    localStorage.removeItem('token');
    navigate("/auth/login", { replace: true });
  }, [auth, navigate]);

  return null;
};
