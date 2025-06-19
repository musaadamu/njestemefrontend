import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearMessages } from '../redux/slices/forgotPasswordSlice';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const dispatch = useDispatch();
    const { message, error, loading } = useSelector(state => state.forgotPassword);

    useEffect(() => {
        dispatch(clearMessages()); // Clear previous messages when component mounts
    }, [dispatch]);

    useEffect(() => {
        if (message) {
            toast.success(message);
            setResetSuccess(true);
            // Redirect after success with a delay to show the success message
            setTimeout(() => navigate('/login'), 3000);
        }
        if (error) {
            toast.error(error);
        }
    }, [message, error, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate password
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        dispatch(resetPassword({ token, password }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Reset Password</h2>

                {resetSuccess ? (
                    <div className="text-center">
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            <p>Your password has been reset successfully!</p>
                            <p className="text-sm mt-2">You will be redirected to the login page shortly.</p>
                        </div>
                        <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                            Go to Login Page
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 mb-6 text-center">
                            Please enter your new password below.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3 text-sm text-gray-600 hover:text-gray-800"
                                        onClick={() => setShowPassword(prev => !prev)}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>

                            <button
                                type="submit"
                                className={`w-full p-3 rounded-md text-white font-medium transition-colors ${
                                    password && confirmPassword ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                                }`}
                                disabled={!password || !confirmPassword || loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Resetting...
                                    </span>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>
                    </>
                )}

                <div className="text-center mt-6 text-sm">
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
