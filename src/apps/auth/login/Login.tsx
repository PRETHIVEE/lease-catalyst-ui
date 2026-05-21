import AuthAPI from "@/api/auth";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("username", "user@leasecat.com");
    formData.append("password", "welcome123");
    // LOGIN API call
    AuthAPI.LoginAPI(formData).then((response) => {
      if (response.data.access_token) {
        const { user_name, name, access_token, user_role, user_id } =
          response.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("name", name);
        localStorage.setItem("user_email", user_name);
        localStorage.setItem("user_role", user_role);
        localStorage.setItem("user_id", user_id);
        navigate("/dashboard");
      } else {
        alert(response.data.message || "Error Logging In");
      }
    });
  };
  return (
    <div>
      Login Page{" "}
      <Button variant="contained" onClick={() => onSubmit()}>
        LOGIN
      </Button>
    </div>
  );
};

export default Login;
