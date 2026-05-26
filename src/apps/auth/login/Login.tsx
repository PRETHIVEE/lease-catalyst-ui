import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthAPI from "@/api/auth";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { Eye, EyeOff } from "lucide-react";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const validationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("username", values.email.trim());
      formData.append("password", values.password);

      setIsSubmitting(true);
      AuthAPI.LoginAPI(formData)
        .then((response) => {
          if (response.data.access_token) {
            const { user_name, name, access_token, user_role, user_id } =
              response.data;
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("name", name);
            localStorage.setItem("user_email", user_name);
            localStorage.setItem("user_role", user_role);
            localStorage.setItem("user_id", user_id);
            if (keepSignedIn) {
              localStorage.setItem("keep_signed_in", "true");
            } else {
              localStorage.removeItem("keep_signed_in");
            }
            navigate("/dashboard");
          } else {
            alert(response.data.message || "Error Logging In");
          }
        })
        .catch(() => {
          alert("Error Logging In");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
  });

  return (
    <section className="auth-form w-full text-left">
      <div className="mb-6 text-left">
        <h1 className="mt-1 text-[1.25rem] font-semibold text-[var(--font-color-primary,#102a43)]">
          Sign In
        </h1>
        <p className="mt-0.6 text-[0.87rem] text-muted-foreground">
          Sign in to your Lease management software.
        </p>
      </div>

      <button type="button" className="auth-social-btn">
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="auth-divider my-4">Or</div>

      <form
        className="flex flex-col gap-4"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <TextField
          id="login-email"
          name="email"
          label="Email"
          type="email"
          // size="small"
          fullWidth
          autoComplete="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          id="login-password"
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          // size="small"
          fullWidth
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4 text-muted-foreground" />
                    ) : (
                      <Eye className="size-4 text-muted-foreground" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <div className="flex items-center justify-between gap-3 my-[-0.75rem]">
          <FormControlLabel
            control={
              <Checkbox
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                size="small"
              />
            }
            label="Keep signed in for 30 days"
          />
          <Link to="/#" className="auth-link shrink-0">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          className="auth-submit-btn"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="auth-footer-note">
        This site is protected by reCAPTCHA and the Google{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="auth-link"
        >
          Privacy Policy
        </a>{" "}
        and{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="auth-link"
        >
          Terms of Service
        </a>{" "}
        apply.
      </p>
    </section>
  );
};

export default Login;
