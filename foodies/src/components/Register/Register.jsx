import React, { useContext, useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser, googleAuth } from "../../service/authService";
import { StoreContext } from "../../context/StoreContext";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const navigate = useNavigate();
  const { setToken, loadCartData } = useContext(StoreContext);
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await googleAuth(credentialResponse.credential);
      if (response.status === 200) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        await loadCartData(response.data.token);
        toast.success("Account created with Google!");
        navigate("/");
      }
    } catch (err) {
      if (err?.code === "ECONNABORTED" || !err?.response?.status) {
        toast.error("Server is starting up — wait 30 seconds and try again.");
      } else {
        toast.error("Google sign-up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await registerUser(data);
      if (response.status === 201) {
        toast.success("Registration completed. Please login.");
        navigate("/login");
      } else {
        toast.error("Unable to register. Please try again");
      }
    } catch (error) {
      const status = error?.response?.status;
      if (status === 409) {
        toast.error("An account with this email already exists. Please login.");
      } else if (error?.code === "ECONNABORTED" || !status) {
        toast.error("Server is waking up — please wait 30 seconds and try again.");
      } else {
        toast.error("Unable to register. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">
                Sign Up
              </h5>
              <form onSubmit={onSubmitHandler}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingName"
                    placeholder="Jhon Doe"
                    name="name"
                    onChange={onChangeHandler}
                    value={data.name}
                    required
                  />
                  <label htmlFor="floatingName">Full Name</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    name="email"
                    onChange={onChangeHandler}
                    value={data.email}
                    required
                  />
                  <label htmlFor="floatingInput">Email</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    name="password"
                    onChange={onChangeHandler}
                    value={data.password}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="d-grid">
                  <button
                    className="btn btn-outline-primary btn-login text-uppercase"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        Creating account...
                      </>
                    ) : "Sign up"}
                  </button>
                  <button
                    className="btn btn-outline-danger btn-login text-uppercase mt-2"
                    type="reset"
                    disabled={loading}
                  >
                    Reset
                  </button>
                </div>
                {loading && (
                  <p className="text-center text-muted mt-2" style={{ fontSize: "0.82rem" }}>
                    Server is starting up — this may take 20–30 seconds on first use.
                  </p>
                )}
                <div className="d-flex align-items-center gap-2 my-3">
                  <hr className="flex-grow-1 m-0" />
                  <span className="text-muted" style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>or continue with</span>
                  <hr className="flex-grow-1 m-0" />
                </div>
                <div className="d-flex justify-content-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google sign-up failed. Please try again.")}
                    theme="outline"
                    shape="rectangular"
                    width="100%"
                  />
                </div>
                <div className="mt-4">
                  Already have an account? <Link to="/login">Sign In</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
