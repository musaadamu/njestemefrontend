import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import "./Dashboard.css"; // Import the CSS file

const Dashboard = () => {
    const { user, loading: userLoading, error: userError } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalJournals: 0
    });

    useEffect(() => {
        if (!userLoading && !user) {
            navigate("/login", { replace: true });
        }
    }, [user, userLoading, navigate]);

    const fetchJournals = async (page = 1) => {
        try {
            setLoading(true);
            setError("");

            console.log('Fetching journals for dashboard...');
            const response = await api.journals.getAll({
                page,
                limit: 10,
                sortBy: 'createdAt',
                order: 'desc'
            });

            console.log('Journals response:', response.data);

            // Handle both array response and paginated response
            const journalsData = Array.isArray(response.data) ?
                response.data :
                response.data.journals || [];

            const paginationData = response.data.pagination || {
                currentPage: page,
                totalPages: 1,
                totalJournals: journalsData.length
            };

            setJournals(journalsData);
            setPagination(paginationData);
        } catch (err) {
            console.error('Fetch journals error:', err);
            let errorMsg = "Failed to fetch journals";

            if (err.code === 'ECONNABORTED') {
                errorMsg = 'Request timed out. Server may be slow or unavailable.';
            } else if (err.response) {
                errorMsg = err.response.data?.message ||
                    (err.response.status === 401 ? 'Please login to view journals' :
                        err.response.status === 404 ? 'No journals found' :
                            'Server error occurred');

                if (err.response.status === 401) {
                    navigate('/login');
                }
            } else if (err.request) {
                errorMsg = 'Network error - unable to reach server';
            } else {
                errorMsg = err.message || 'Error fetching journals';
            }

            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchJournals();
        }
    }, [user]);

    if (userLoading || loading) return <div className="loading-spinner">Loading dashboard...</div>;

    if (userError || error) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{userError || error}</div>;
    }

    const handleViewJournal = (id) => {
        navigate(`/journals/${id}`);
    };

    const handleDownload = async (id, fileType) => {
        try {
            console.log(`Downloading journal ${id} as ${fileType}...`);
            const response = await api.journals.download(id, fileType);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            const journal = journals.find(j => j._id === id);
            link.href = url;
            link.setAttribute('download', `${journal?.title || 'journal'}.${fileType}`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success(`Journal downloaded as ${fileType.toUpperCase()}`);
        } catch (err) {
            console.error('Download error:', err);
            let errorMsg = `Failed to download ${fileType.toUpperCase()} file`;
            if (err.code === 'ECONNABORTED') {
                errorMsg = 'Download timed out. File may be too large or server is slow.';
            }
            toast.error(errorMsg);
        }
    };

    return (
        <div className="dashboard-container">
            {/* Navigation Bar */}
            <nav className="dashboard-nav">
                <div className="nav-content">
                    <div className="nav-logo">COELSN Journal</div>
                    <div className="nav-links">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/about" className="nav-link">About Us</Link>
                        <Link to="/submissions" className="nav-link">Make Submissions</Link>
                        <Link to="/current-issue" className="nav-link">Current Issue</Link>
                        <Link to="/archive" className="nav-link">Archive</Link>
                        {user?.role === "admin" && (
                            <Link to="/manage-journals" className="nav-link">Manage Journals</Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Dashboard Content */}
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <div>
                        <h2 className="dashboard-title">Welcome to Dashboard</h2>
                        <p className="dashboard-user">User: {user?.email}</p>
                    </div>
                    <div className="dashboard-actions">
                        <Link to="/updateprofile" className="profile-button">
                            Update Profile
                        </Link>
                    </div>
                </div>

                {journals.length > 0 ? (
                    <>
                        <div className="journal-list">
                            {journals.map((journal) => (
                                <div key={journal._id} className="journal-card">
                                    <h3
                                        className="journal-title cursor-pointer hover:underline"
                                        onClick={() => handleViewJournal(journal._id)}
                                    >
                                        {journal.title || 'Untitled Journal'}
                                    </h3>
                                    <p className="journal-abstract">
                                        {journal.abstract || 'No abstract available'}
                                    </p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                                        journal.status === "Published" ? "bg-green-600 text-white" : "bg-gray-300 text-gray-700"
                                    }`}>
                                        {journal.status || 'Draft'}
                                    </span>

                                    <div className="journal-actions">
                                        <button
                                            onClick={() => handleViewJournal(journal._id)}
                                            className="action-button view-button"
                                        >
                                            View
                                        </button>
                                    <button
                                        onClick={() => handleDownload(journal._id, 'pdf')}
                                        className="action-button pdf-button"
                                    >
                                        PDF
                                    </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => fetchJournals(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className="pagination-button prev-button"
                                >
                                    Previous
                                </button>
                                <span className="page-info">
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => fetchJournals(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="pagination-button next-button"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="no-journals">No journals available</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
