import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, error, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            console.log('User logged in:', user);
            // Redirect to dashboard for all users
            // Users can navigate to other pages from there
            navigate("/dashboard", { replace: true });
            toast.success(`Welcome back, ${user.name || user.email}!`);
        }
    }, [user, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim() || !password) {
            toast.error("Please fill in all fields.");
            return;
        }
        dispatch(loginUser({ email: email.trim(), password }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block font-semibold">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full p-3 border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block font-semibold">Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full p-3 border rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full p-3 rounded-md text-white ${email && password ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
                        disabled={!email || !password || loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <Link to="/forgotpassword" className="text-blue-500 hover:underline">Forgot Password?</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
