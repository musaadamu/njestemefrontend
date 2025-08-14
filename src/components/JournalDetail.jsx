import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import './JournalDetails.css';

// Custom hook to manage document head
const useDocumentHead = (title, description, keywords, ogData, structuredData) => {
    useEffect(() => {
        // Update document title
        if (title) {
            document.title = title;
        }

        // Update meta tags
        const updateMetaTag = (name, content, property = false) => {
            if (!content) return;

            const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
            let meta = document.querySelector(selector);

            if (!meta) {
                meta = document.createElement('meta');
                if (property) {
                    meta.setAttribute('property', name);
                } else {
                    meta.setAttribute('name', name);
                }
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        // Update basic meta tags
        updateMetaTag('description', description);
        updateMetaTag('keywords', keywords);

        // Update Open Graph tags
        if (ogData) {
            updateMetaTag('og:title', ogData.title, true);
            updateMetaTag('og:description', ogData.description, true);
            updateMetaTag('og:type', ogData.type, true);
            updateMetaTag('og:url', ogData.url, true);
        }

        // Update structured data
        if (structuredData) {
            let script = document.querySelector('script[type="application/ld+json"]');
            if (!script) {
                script = document.createElement('script');
                script.type = 'application/ld+json';
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(structuredData);
        }

        // Cleanup function to reset title when component unmounts
        return () => {
            document.title = 'IJIRSTME - International Journal';
        };
    }, [title, description, keywords, ogData, structuredData]);
};

// Add Cloudinary URLs for direct access as a last resort
const CLOUDINARY_PDF_URLS = [
    'https://res.cloudinary.com/musaadamu/raw/upload/v1746729149/coelsN_Uploads/1746729142888-1746729142665-tagans5.pdf',
    'https://res.cloudinary.com/musaadamu/raw/upload/v1746728320/coelsN_Uploads/1746728285131-1746728284548-Tagans4.pdf',
    'https://res.cloudinary.com/musaadamu/raw/upload/v1746723286/coelsN_Uploads/1746723283897-1746723283544-Tangas1.pdf'
];

// Helper function to try all Cloudinary URLs as a last resort
const tryAllCloudinaryUrls = (title) => {
    toast.info(`Trying direct Cloudinary access as last resort...`);

    // Try to find a matching URL based on title
    let urlIndex = 0;
    if (title) {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('tagans5')) urlIndex = 0;
        else if (titleLower.includes('tagans4')) urlIndex = 1;
        else if (titleLower.includes('tangas1')) urlIndex = 2;
    }

    // Open the URL as a fallback
    window.open(CLOUDINARY_PDF_URLS[urlIndex], '_blank');

    // If we're not sure which URL is correct, try the others after a delay
    setTimeout(() => {
        toast.info(`Trying alternative Cloudinary URL...`);
        window.open(CLOUDINARY_PDF_URLS[(urlIndex + 1) % 3], '_blank');
    }, 3000);
};

const JournalDetail = () => {
    const { id } = useParams(); // Get the journal ID from the URL
    const [journal, setJournal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJournal = async () => {
            try {
                console.log('Fetching journal details for ID:', id);
                const response = await api.journals.getById(id);
                console.log("Journal data:", response.data); // Debug log
                setJournal(response.data);
            } catch (err) {
                console.error('Error fetching journal:', err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJournal();
    }, [id]);

    const handleDownload = async (fileType) => {
        try {
            // Show loading toast
            const toastId = toast.loading(`Preparing ${fileType.toUpperCase()} download...`);

            console.log(`Downloading ${fileType} file for journal ID:`, id);

            // Try using the API service's download method first
            try {
                const response = await api.journals.download(id, fileType);
                
                // Create a blob and download link
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

    if (loading) return <p className="text-gray-600">Loading...</p>;
    if (error) return <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>;

    // Prepare structured data for SEO
    const structuredData = journal ? {
        "@context": "https://schema.org",
        "@type": "ScholarlyArticle",
        "headline": journal.title,
        "abstract": journal.abstract,
        "author": Array.isArray(journal.authors) ? journal.authors.map(author => ({
            "@type": "Person",
            "name": typeof author === 'string' ? author : author.name
        })) : [],
        "datePublished": journal.publishedDate ? new Date(journal.publishedDate).toISOString() : new Date().toISOString(),
        "keywords": Array.isArray(journal.keywords) ? journal.keywords.join(', ') : '',
        "publisher": {
            "@type": "Organization",
            "name": "International Journal of Innovative Research in Science Technology and Mathematics Education (IJIRSTME)"
        },
        "url": `https://njostemejournal.com.ng/journals/${journal._id}`
    } : {};

    // Use custom hook to manage document head
    useDocumentHead(
        journal?.title ? `${journal.title} - IJIRSTME` : 'Journal Details - IJIRSTME',
        journal?.abstract?.substring(0, 160) || `View details of the research paper: ${journal?.title || 'Untitled Journal'}`,
        journal?.keywords?.join(', ') || 'research, journal, science, technology, engineering, mathematics, education',
        {
            title: journal?.title || 'Untitled Journal',
            description: journal?.abstract?.substring(0, 200) || 'Research paper details',
            type: 'article',
            url: `https://njostemejournal.com.ng/journals/${id}`
        },
        structuredData
    );

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg">

            <h2 className="text-2xl font-bold mb-4">{journal?.title || 'Untitled Journal'}</h2>

            <div className="space-y-3">
                <p className="text-justify"><strong>Abstract:</strong> {journal?.abstract || 'No abstract available'}</p>
                <p><strong>Content:</strong> {journal?.content || 'Download PDF or WORD file'}</p>

                {/* Download buttons section */}
                <div className="flex flex-wrap gap-4 my-4">
                    {/* PDF download button */}
                    <button
                        onClick={() => handleDownload('pdf')}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 ease-in-out flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download PDF
                    </button>

                    {/* DOCX download button */}
                    <button
                        onClick={() => handleDownload('docx')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download DOCX
                    </button>
                </div>

                <p><strong>Keywords:</strong> {journal?.keywords?.join(', ') || 'No keywords'}</p>
                <p><strong>Status:</strong> {journal?.status || 'Unknown'}</p>
                <p><strong>Published Date:</strong> {journal?.publishedDate ? new Date(journal.publishedDate).toLocaleDateString() : 'Not published yet'}</p>
            </div>
        </div>
    );
};

export default JournalDetail;
