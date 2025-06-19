import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendResetEmail, clearMessages } from '../redux/slices/forgotPasswordSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const dispatch = useDispatch();
    const { message, error, loading } = useSelector(state => state.forgotPassword);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearMessages());
        }
        if (message) {
            toast.success(message);
            setSubmitted(true);
            dispatch(clearMessages());
        }
    }, [error, message, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error("Please enter a valid email.");
            return;
        }
        dispatch(sendResetEmail(email.trim()));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Forgot Password</h2>

                {submitted ? (
                    <div className="text-center">
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            <p>Password reset link has been sent to your email.</p>
                            <p className="text-sm mt-2">Please check your inbox and follow the instructions.</p>
                        </div>
                        <p className="mt-4">Didn't receive the email? Check your spam folder or</p>
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setEmail('');
                            }}
                            className="text-blue-600 hover:text-blue-800 underline mt-2"
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 mb-6 text-center">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>
                            <button
                                type="submit"
                                className={`w-full p-3 rounded-md text-white font-medium transition-colors ${
                                    email ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                                }`}
                                disabled={!email || loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    'Send Reset Link'
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

export default ForgotPassword;
