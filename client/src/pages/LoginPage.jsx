import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 text-3xl font-bold font-serif flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 flex justify-center items-center">
      <form
        onSubmit={handleLogin}
        className="bg-gray-400 w-125 h-125 rounded-3xl py-14"
      >
        <div className="items-center flex flex-col">
          <p className="text-3xl text-gray-900 font-serif font-semibold">
            Login
          </p>
        </div>

        {error && (
          <p className="font-bold text-red-800 text-xl mt-4 text-center">
            {error}
          </p>
        )}

        <div className="flex flex-col mt-14 mx-8 gap-4">
          <div className="flex flex-col gap-1">
            <div className="">Email</div>
            <input
              type="email"
              className="border rounded-2xl py-3 px-2"
              placeholder="Input the email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="">Password</div>
            <input
              type="password"
              placeholder="Input the password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-2xl py-3 px-2"
            />
          </div>
        </div>
        <div className="flex justify-end mx-8 mt-10">
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-600 px-10 py-3 rounded-3xl hover:bg-gray-700 cursor-pointer active:bg-gray-800 focus:outline-2 focus:outline-offset-2"
          >
            {loading ? "Loading" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
