import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Email, Lock, User } from "../utils/Svgs";
import axios from "axios";
import { AuthState } from "../context/AuthContext";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { setToken, user } = AuthState();

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const onSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axios
      .post(`${import.meta.env.VITE_SERVER}/api/auth/register`, {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
      .catch((err) => {
        toast.success(err.response.data.message);
      });
    if (data.status === "success") {
      setToken(data.token);
      toast.success("Successfully Signed In");
    }
  };

  useEffect(() => {
    if (user) navigate("/home");
  }, [user]);

  return (
    <div className="container">
      <h1>Welcome</h1>
      <p>Sign up to continue</p>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="username">USERNAME</label>
          <div className="input_wrapper">
            <User />
            <input
              ref={nameRef}
              type="text"
              name="username"
              id="username"
              required
              placeholder="Rahul"
            />
          </div>
        </div>
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
        <button type="submit">SIGN UP</button>
      </form>
      <p className="login_page_link">
        First Time ?
        <Link to={"/login"}>
          <span>Login</span>
        </Link>
      </p>
    </div>
  );
};

export default Signup;
