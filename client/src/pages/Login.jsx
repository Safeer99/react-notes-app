import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Email, Lock } from "../utils/Svgs";
import axios from "axios";
import { AuthState } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { HOST, setToken, user } = AuthState();

  const emailRef = useRef();
  const passwordRef = useRef();

  const onSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axios
      .post(`${HOST}/api/auth/login`, {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
    if (data.status === "success") {
      setToken(data.token);
      toast.success("Successfully Logged In");
    }
  };

  useEffect(() => {
    if (user) navigate("/home");
  }, [user]);

  return (
    <div className="container">
      <h1>Welcome</h1>
      <p>Sign in to continue</p>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="email">EMAIL</label>
          <div className="input_wrapper">
            <Email />
            <input
              ref={emailRef}
              type="email"
              name="email"
              id="email"
              required
              placeholder="example@gmail.com"
            />
          </div>
        </div>
        <div>
          <label htmlFor="password">PASSWORD</label>
          <div className="input_wrapper">
            <Lock />
            <input
              ref={passwordRef}
              type="password"
              name="password"
              id="password"
              required
              placeholder="********"
            />
          </div>
        </div>
        <button type="submit">LOGIN</button>
      </form>
      <p className="signup_page_link">
        Already have an account ?{" "}
        <Link to={"/signup"}>
          <span>Sign up</span>
        </Link>
      </p>
    </div>
  );
};

export default Login;
