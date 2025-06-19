import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import Navigation from '../components/Navigation.jsx';

// Add Cloudinary URLs for direct access as a last resort
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

    if (loading) return <div className="text-center py-10">Loading journals...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Journal Archive</h1>
                
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                        <p>{error}</p>
                    </div>
                )}
                
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                        <div className="flex flex-wrap items-center gap-4">
                            <select 
                                value={filter} 
                                onChange={(e) => setFilter(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="Published">Published</option>
                                <option value="Draft">Draft</option>
                            </select>
                            
                            <select 
                                value={yearFilter} 
                                onChange={(e) => setYearFilter(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="all">All Years</option>
                                {availableYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full sm:w-auto">
                            <input 
                                type="text" 
                                placeholder="Search journals..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {filteredJournals.length === 0 ? (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No journals found matching your criteria
                            </div>
                        ) : (
                            filteredJournals.map(journal => (
                                <div key={journal._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                                    <div className="p-6">
                                        <div className="flex flex-col mb-4">
                                            <h2 
                                                className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer mb-2"
                                                onClick={() => navigate(`/journals/${journal._id}`)}
                                            >
                                                {journal.title}
                                            </h2>
                                            
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <i className="fas fa-calendar-alt"></i>
                                                    {new Date(journal.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    journal.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {journal.status || 'Draft'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Abstract</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {journal.abstract || 'No abstract available'}
                                            </p>
                                        </div>
                                        
                                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                                <i className="fas fa-users mr-2"></i>Authors
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {Array.isArray(journal.authors) 
                                                    ? journal.authors.join(', ')
                                                    : typeof journal.authors === 'string'
                                                        ? journal.authors
                                                        : 'Unknown'}
                                            </p>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <button
                                                onClick={() => navigate(`/journals/${journal._id}`)}
                                                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <i className="fas fa-eye mr-2"></i>
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDownload(journal._id, 'pdf')}
                                                className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                <i className="fas fa-file-pdf mr-2"></i>
                                                PDF
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JournalArchive;
