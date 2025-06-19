import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            toast.success("Registration successful! Redirecting...");
            setTimeout(() => navigate("/login"), 1500);
        }
    }, [user, navigate]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword } = formData;

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            return toast.error("All fields are required");
        }

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        // Always set role to 'author' for security
        dispatch(registerUser({ name: name.trim(), email: email.trim(), password, role: 'author' }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                            className="w-full p-3 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full p-3 border rounded-md"
                        />
                    </div>

                    {/* Role is automatically set to 'author' for all new registrations */}

                    {/* Password Field */}
                    <div>
                        <label className="block font-semibold">Password:</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className="w-full p-3 border rounded-md pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-sm"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block font-semibold">Confirm Password:</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                                className="w-full p-3 border rounded-md pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-sm"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full p-3 rounded-md text-white ${formData.name && formData.email && formData.password && formData.confirmPassword ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
                        disabled={!formData.name || !formData.email || !formData.password || !formData.confirmPassword || loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <Link to="/login" className="text-blue-500 hover:underline">Already have an account? Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
