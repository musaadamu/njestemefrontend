import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { FiBookOpen, FiUsers, FiGrid, FiCalendar, FiSearch, FiDownload } from 'react-icons/fi';

// Helper function to try all Cloudinary URLs as a last resort
const CLOUDINARY_PDF_URLS = [
    'https://res.cloudinary.com/musaadamu/raw/upload/v1746729149/October-December_2023_Volume_2_Issue_4_Final_j8apca.pdf',
    'https://res.cloudinary.com/musaadamu/raw/upload/v1746729149/October_2023_Volume_2_Issue_4_Final_Copy_jl6czk.pdf'
];

// Helper function to try all Cloudinary URLs as a last resort
const tryAllCloudinaryUrls = async (title) => {
    for (const url of CLOUDINARY_PDF_URLS) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return url;
            }
        } catch (error) {
            console.error('Error trying Cloudinary URL:', error);
        }
    }
    return null;
};

const JournalArchive = () => {
    const navigate = useNavigate();
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredJournals, setFilteredJournals] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const [filter, setFilter] = useState('all');
    const [yearFilter, setYearFilter] = useState('all');
    const [availableYears, setAvailableYears] = useState([]);

    // Stats data
    const stats = [
        {
            title: "Published Articles",
            value: "100+",
            icon: <FiBookOpen className="w-8 h-8" />
        },
        {
            title: "Expert Reviewers",
            value: "50+",
            icon: <FiUsers className="w-8 h-8" />
        },
        {
            title: "Research Fields",
            value: "12",
            icon: <FiGrid className="w-8 h-8" />
        },
        {
            title: "Issues Per Year",
            value: "4",
            icon: <FiCalendar className="w-8 h-8" />
        }
    ];

    useEffect(() => {
        fetchJournals();
    }, []);

    useEffect(() => {
        // Filter and sort journals whenever journals, searchTerm, sortConfig, filter, or yearFilter changes
        let result = [...journals];
        
        // Extract all available years from journal dates
        if (journals.length > 0) {
            const years = [...new Set(journals.map(journal => 
                new Date(journal.createdAt).getFullYear()
            ))].sort((a, b) => b - a); // Sort years in descending order
            
            setAvailableYears(years);
        }
        
        // Apply status filter
        if (filter !== 'all') {
            result = result.filter(journal => journal.status === filter);
        }
        
        // Apply year filter
        if (yearFilter !== 'all') {
            result = result.filter(journal => 
                new Date(journal.createdAt).getFullYear() === parseInt(yearFilter)
            );
        }
        
        // Apply search filter
        if (searchTerm) {
            result = result.filter(journal => 
                journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                journal.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (journal.authors && journal.authors.some(author => 
                    author.toLowerCase().includes(searchTerm.toLowerCase())
                ))
            );
        }
        
        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        
        setFilteredJournals(result);
    }, [journals, searchTerm, sortConfig, filter, yearFilter]);

    const fetchJournals = async () => {
        setLoading(true);
        try {
            const response = await api.journals.getAll();
            setJournals(response.data);
        } catch (err) {
            console.error('Error fetching journals:', err);
            setError('Failed to load journals. Please try again later.');
            toast.error('Failed to load journals');
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
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

            // As a last resort for PDFs, try using the Cloudinary URLs directly
            if (fileType === 'pdf') {
                try {
                    const journal = journals.find(j => j._id === id);
                    if (journal) {
                        toast.info('Attempting direct Cloudinary access...');
                        tryAllCloudinaryUrls(journal.title);
                    }
                } catch (cloudinaryError) {
                    console.error('Cloudinary direct access failed:', cloudinaryError);
                }
            }
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className="text-emerald-600 text-xl font-semibold">Loading journals...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
            {/* Stats Section */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 shadow-lg py-12 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white mb-4">Journal Statistics</h2>
                        <div className="w-20 h-1 bg-accent-500 mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} 
                                className="relative overflow-hidden bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-xl transform hover:scale-105 transition-all duration-300">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-full bg-white/20 text-white">
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                                        <div className="text-emerald-100">{stat.title}</div>
                                    </div>
                                </div>
                                {/* Decorative gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 pointer-events-none"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-emerald-100">
                    <div className="p-6 border-b border-emerald-100">
                        <h1 className="text-3xl font-bold text-emerald-800 mb-2">Journal Archive</h1>
                        <p className="text-emerald-600">Browse through our collection of published articles</p>
                    </div>
                
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 m-6" role="alert">
                            <p>{error}</p>
                        </div>
                    )}
                    
                    <div className="p-6">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            {/* Search and filter controls */}
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search journals..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                    />
                                    <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                                </div>
                            </div>

                            {/* Filter controls */}
                            <div className="flex gap-4 flex-wrap">
                                <select
                                    value={yearFilter}
                                    onChange={(e) => setYearFilter(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                                >
                                    <option value="all">All Years</option>
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Journals grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredJournals.map((journal) => (
                                <div key={journal._id} 
                                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-emerald-100 overflow-hidden">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-emerald-800 mb-2">{journal.title}</h3>
                                        <p className="text-emerald-600 text-sm mb-4 line-clamp-2">{journal.abstract}</p>
                                        <div className="flex items-center justify-between mt-4">
                                            <button
                                                onClick={() => handleDownload(journal._id, 'pdf')}
                                                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                                            >
                                                <FiDownload className="mr-2" />
                                                Download PDF
                                            </button>
                                            <span className="text-emerald-500 text-sm">
                                                {new Date(journal.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JournalArchive;
