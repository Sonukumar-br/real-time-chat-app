import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, setUserData } from "../redux/userSlice";

function Login() {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch=useDispatch()
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await axios.post(
        `${serverURL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data.user))
      dispatch(setSelectedUser(null))
      localStorage.setItem("userData", JSON.stringify(result.data.user))

      
      setEmail("");
      setPassword("");
      navigate("/"); // login ke baad redirect
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-200 flex items-center justify-center">
      <div className="w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-lg flex flex-col gap-[30px]">
        <div className="w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] flex items-center justify-center">
          <h1 className="text-gray-600 font-bold text-[30px]">
            Login To <span className="text-white">Chatly</span>
          </h1>
        </div>

        <form className="w-full flex flex-col gap-[20px] items-center" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-[90%] h-[50px] border-2 border-[#20c7ff] px-5 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <div className="w-[90%] h-[50px] border-2 border-[#20c7ff] rounded-lg relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              className="w-full h-full px-5 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <span
              className="absolute top-[12px] right-[20px] cursor-pointer text-[#20c7ff]"
              onClick={() => setShow((p) => !p)}
            >
              {show ? "hide" : "show"}
            </span>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#20c7ff] w-[200px] py-2 rounded-2xl text-white font-semibold"
          >
            {loading ? "Loading..." : "Login"}
          </button>

          <p className="cursor-pointer" onClick={() => navigate("/signup")}>
            Want To Create An Account?{" "}
            <span className="text-[#20c7ff] font-bold">Sign Up</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

