import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import SocialLogin from "../SocialLogin/SocialLogin";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    signIn(email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setSuccess("Successfully Logged in!");
        navigate("/");
      })
      .catch((err) => {
        console.log(err.message)
        setError(err.message);
      });
  };

  return (
    <div>
      <div className="hero">
        <div className="hero-content">
          <div className="card w-full shadow-2xl">
            <form onSubmit={handleLogin}>
              <div className="card-body">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="text"
                    name="email"
                    placeholder="email"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="text"
                    name="password"
                    placeholder="password"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-accent">
                    Login
                  </button>
                </div>
                <p className="text-red-500">{error}</p>
                <p className="text-yellow-500">{success}</p>
                <SocialLogin></SocialLogin>
                <small>
                  Don&apos;t have an account?
                  <Link to="/register" className="text-blue-400">
                    {" "}
                    Register Here
                  </Link>
                </small>
                
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
