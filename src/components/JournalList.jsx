import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSearch, FiFilter, FiDownload, FiEye, FiCalendar, FiUser, FiBook } from 'react-icons/fi';
import './JournalList.css';

// Import the API service and utilities
import api from '../services/api';
import { downloadJournalFile } from '../utils/fileDownload';

const JournalList = () => {
    const navigate = useNavigate();
    const [journals, setJournals] = useState([]);
    const [filteredJournals, setFilteredJournals] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalJournals: 0,
        limit: 9 // Changed to 9 journals per page (3 per row)
    });

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        journal: 'all',
        year: 'any',
        author: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    // Define fetchJournals with useCallback to avoid dependency issues
    const fetchJournals = useCallback(async (page = 1) => {
        setLoading(true);
        setError('');
        try {
            console.log('Fetching journals using API service');
            const response = await api.journals.getAll({
                page,
                limit: 9,
                sortBy: 'createdAt',
                order: 'desc'
            });

            console.log('API Response:', response.data);

            if (!response.data) {
                throw new Error('No data received from server');
            }

            // Handle both array response and paginated response formats
            const journalsData = Array.isArray(response.data) ?
                response.data :
                response.data.journals || [];

            // Ensure we have valid pagination data with fallbacks for each property
            const paginationData = {
                currentPage: Number(response.data.pagination?.currentPage || page || 1),
                totalPages: Number(response.data.pagination?.totalPages || Math.ceil(journalsData.length / 9) || 1),
                totalJournals: Number(response.data.pagination?.totalJournals || journalsData.length || 0),
                limit: 9
            };

            console.log('Pagination data:', paginationData);

            setJournals(journalsData);
            setFilteredJournals(journalsData);
            setPagination(paginationData);
        } catch (err) {
            console.error('Fetch journals error:', err);
            let errorMsg = 'Failed to fetch journals';

            if (err.response) {
                errorMsg = err.response.data?.message ||
                         (err.response.status === 401 ? 'Unable to fetch all journals. Some features may require login.' :
                         err.response.status === 404 ? 'Journal endpoint not found' :
                         'Server error occurred');

                // Don't redirect to login for unauthorized errors
                // This allows public access to the home page
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
    }, [navigate]);

    useEffect(() => {
        fetchJournals();
    }, [fetchJournals]);

    // Apply search and filters
    useEffect(() => {
        if (!journals.length) return;

        let results = [...journals];

        // Apply search term
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            results = results.filter(journal =>
                (journal.title && journal.title.toLowerCase().includes(term)) ||
                (journal.abstract && journal.abstract.toLowerCase().includes(term)) ||
                (journal.authors && journal.authors.some(author =>
                    author.name && author.name.toLowerCase().includes(term)
                ))
            );
        }

        // Apply journal filter
        if (filters.journal !== 'all') {
            results = results.filter(journal =>
                journal.journalName && journal.journalName === filters.journal
            );
        }

        // Apply year filter
        if (filters.year !== 'any') {
            const year = parseInt(filters.year);
            results = results.filter(journal => {
                const journalYear = journal.publicationDate ?
                    new Date(journal.publicationDate).getFullYear() : null;
                return journalYear === year;
            });
        }

        // Apply author filter
        if (filters.author.trim()) {
            const authorTerm = filters.author.toLowerCase();
            results = results.filter(journal =>
                journal.authors && journal.authors.some(author =>
                    author.name && author.name.toLowerCase().includes(authorTerm)
                )
            );
        }

        setFilteredJournals(results);
    }, [searchTerm, filters, journals]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilters = () => {
        // Filters are already applied via useEffect
        setShowFilters(false);
    };

    const resetFilters = () => {
        setFilters({
            journal: 'all',
            year: 'any',
            author: ''
        });
        setSearchTerm('');
    };

    const handleDownload = async (id, fileType) => {
        try {
            // Show loading toast
            const toastId = toast.loading(`Preparing ${fileType.toUpperCase()} download...`);

            console.log(`Downloading ${fileType} file for journal ID:`, id);

            // Try using the API service's download method first
            try {
                const response = await api.journals.download(id, fileType);

                // Create a blob and download link
                const journal = journals.find(j => j._id === id);
                const blob = new Blob([response.data], { type: `application/${fileType}` });
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.setAttribute('download', `${journal?.title || 'journal'}.${fileType}`);
                document.body.appendChild(link);
                link.click();

                // Clean up
                setTimeout(() => {
                    window.URL.revokeObjectURL(blobUrl);
                    link.remove();
                }, 100);

                toast.dismiss(toastId);
                toast.success(`File downloaded as ${fileType.toUpperCase()}`);
                return;
            } catch (apiError) {
                console.error('API download failed:', apiError);
                // Continue to direct URL approach
            }

            // Fallback to direct URL approach
            const baseUrl = api.defaults.baseURL || 'https://coels-backend.onrender.com/api';
            const downloadUrl = `${baseUrl}/journals/${id}/direct-download/${fileType}`;

            console.log('Using direct download URL:', downloadUrl);

            // Open the URL in a new tab
            window.open(downloadUrl, '_blank');

            toast.dismiss(toastId);
            toast.success(`Opening ${fileType.toUpperCase()} file in new tab`);

        } catch (err) {
            console.error(`Error downloading ${fileType} file:`, err);
            toast.error(`Failed to download ${fileType.toUpperCase()} file`);
        }
    };

    // Get unique journal names and years for filters
    const journalNames = [...new Set(journals.filter(j => j.journalName).map(j => j.journalName))];
    const publicationYears = [...new Set(journals
        .filter(j => j.publicationDate)
        .map(j => new Date(j.publicationDate).getFullYear())
    )].sort((a, b) => b - a); // Sort years in descending order

    if (loading) return <div className="loading-spinner">Loading journals...</div>;

    return (
        <div className="modern-journal-list-container">
            <div className="journal-list-header">
                <h1>Discover Articles</h1>
<p>Explore the latest research from Nigerian Journal of Science, Technology, Engineering and Mathematics Education (NJOSTEME)</p>
            </div>

            {/* Search and Filter Section */}
            <div className="search-filter-section">
                <div className="search-container">
                    <div className="search-input-wrapper">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search articles by keyword, title, author..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="search-input"
                        />
                    </div>
                    <button className="search-button">Search</button>
                </div>

                <div className="filter-toggle">
                    <button
                        className="filter-button"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FiFilter /> Filter Articles
                    </button>
                </div>

                {showFilters && (
                    <div className="filter-panel">
                        <h3>Filter Articles</h3>
                        <div className="filter-options">
                            <div className="filter-group">
                                <label><FiBook /> Journal</label>
                                <select
                                    name="journal"
                                    value={filters.journal}
                                    onChange={handleFilterChange}
                                >
                                    <option value="all">All Journals</option>
                                    {journalNames.map(name => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <label><FiCalendar /> Publication Year</label>
                                <select
                                    name="year"
                                    value={filters.year}
                                    onChange={handleFilterChange}
                                >
                                    <option value="any">Any Year</option>
                                    {publicationYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <label><FiUser /> Author Name</label>
                                <input
                                    type="text"
                                    name="author"
                                    placeholder="e.g., Dr. Smith"
                                    value={filters.author}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        </div>
                        <div className="filter-actions">
                            <button className="apply-filters" onClick={applyFilters}>Apply Filters</button>
                            <button className="reset-filters" onClick={resetFilters}>Reset</button>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="error-alert" role="alert">
                    <span>{error}</span>
                </div>
            )}

            {/* Journal Grid - 3 per row */}
            <div className="journal-grid">
                {filteredJournals.length > 0 ? (
                    filteredJournals.map(journal => (
                        <div key={journal._id} className="journal-card">
                            <div className="journal-card-header">
                                <Link 
                                    to={`/journals/${journal._id}`} 
                                    className="journal-title-link"
                                >
                                    <h3>{journal.title}</h3>
                                </Link>
                                <div className="journal-meta">
                                    <span className="journal-date">
                                        <FiCalendar />
                                        {journal.publicationDate ?
                                            new Date(journal.publicationDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : 'Date not available'}
                                    </span>
                                    {journal.journalName && (
                                        <span className="journal-name">
                                            <FiBook />
                                            {journal.journalName}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="abstract-section">
                                <h4 className="abstract-heading">Abstract</h4>
                                <p className="journal-abstract">
                                    {journal.abstract || 'No abstract available'}
                                </p>
                            </div>

                            {journal.authors && journal.authors.length > 0 && (
                                <div className="authors-section">
                                    <h5>
                                        <FiUser className="inline-icon" />
                                        Authors
                                    </h5>
                                    <p>
                                        <FiUser className="inline-icon" />
                                        {Array.isArray(journal.authors) 
                                            ? journal.authors.map(author => typeof author === 'string' ? author : author.name).join(', ')
                                            : typeof journal.authors === 'string' 
                                                ? journal.authors 
                                                : 'Authors not available'
                                        }
                                    </p>
                                </div>
                            )}

                            {journal.keywords && journal.keywords.length > 0 && (
                                <div className="keywords-section">
                                    <div className="keyword-list">
                                        {journal.keywords.map((keyword, idx) => (
                                            <span key={idx} className="keyword-tag">
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="journal-actions">
                                <Link to={`/journals/${journal._id}`} className="view-button">
                                    <FiEye /> View Full Article
                                </Link>
                                <button
                                    className="download-button"
                                    onClick={() => handleDownload(journal._id, 'pdf')}
                                >
                                    <FiDownload /> Download PDF
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No journals found matching your criteria.</p>
                        <button onClick={resetFilters} className="reset-search">Reset Search</button>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredJournals.length > 0 && (
                <div className="pagination-container">
                    <div className="pagination">
                        <button
                            className="pagination-button"
                            disabled={pagination.currentPage === 1}
                            onClick={() => fetchJournals(pagination.currentPage - 1)}
                        >
                            Previous
                        </button>

                        {/* Page numbers */}
                        {[...Array(pagination.totalPages).keys()].map(number => (
                            <button
                                key={number + 1}
                                className={`pagination-button ${pagination.currentPage === number + 1 ? 'active' : ''}`}
                                onClick={() => fetchJournals(number + 1)}
                            >
                                {number + 1}
                            </button>
                        ))}

                        <button
                            className="pagination-button"
                            disabled={pagination.currentPage === pagination.totalPages}
                            onClick={() => fetchJournals(pagination.currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                    <div className="page-info">
                        Showing page {pagination.currentPage} of {pagination.totalPages}
                        ({pagination.totalJournals} total articles)
                    </div>
                </div>
            )}
        </div>
    );
};

export default JournalList;
