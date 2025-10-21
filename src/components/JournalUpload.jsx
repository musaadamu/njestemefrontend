import React, { useState } from "react";
import "./JournalUpload.css";
import Navigation from "./Navigation"
import api from "../services/api";
// Using native Clipboard API for copy buttons (no extra dependency)

const JournalUpload = () => {
    const [formData, setFormData] = useState({
        title: "",
        abstract: "",
        authors: "",
        keywords: "",
    });
    const [pdfFile, setPdfFile] = useState(null);
    const [docxFile, setDocxFile] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [cloudinaryUrls, setCloudinaryUrls] = useState({ pdf: null, docx: null, pdfId: null, docxId: null });
    const [pdfDragActive, setPdfDragActive] = useState(false);
    const [docxDragActive, setDocxDragActive] = useState(false);
    const [pdfFileName, setPdfFileName] = useState("");
    const [docxFileName, setDocxFileName] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePdfFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setPdfFile(selectedFile);
            setPdfFileName(selectedFile.name);
        }
    };

    const handleDocxFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setDocxFile(selectedFile);
            setDocxFileName(selectedFile.name);
        }
    };

    const handlePdfDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setPdfDragActive(true);
        } else if (e.type === "dragleave") {
            setPdfDragActive(false);
        }
    };

    const handleDocxDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDocxDragActive(true);
        } else if (e.type === "dragleave") {
            setDocxDragActive(false);
        }
    };

    const handlePdfDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setPdfDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.name.endsWith('.pdf')) {
                setPdfFile(droppedFile);
                setPdfFileName(droppedFile.name);
                // Update the file input value for validation
                document.getElementById("pdfFileInput").files = e.dataTransfer.files;
            } else {
                setError("Please upload a PDF document (.pdf).");
                setTimeout(() => setError(""), 3000);
            }
        }
    };

    const handleDocxDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDocxDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.name.endsWith('.docx')) {
                setDocxFile(droppedFile);
                setDocxFileName(droppedFile.name);
                // Update the file input value for validation
                document.getElementById("docxFileInput").files = e.dataTransfer.files;
            } else {
                setError("Please upload a Word document (.docx).");
                setTimeout(() => setError(""), 3000);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        // Validate PDF file
        if (!pdfFile) {
            setError("Please upload a PDF document (.pdf).");
            setLoading(false);
            return;
        }

        // Validate DOCX file
        if (!docxFile) {
            setError("Please upload a Word document (.docx).");
            setLoading(false);
            return;
        }

        if (!formData.title.trim()) {
            setError("Please enter a title for your journal.");
            setLoading(false);
            return;
        }

        if (!formData.abstract.trim()) {
            setError("Please provide an abstract for your journal.");
            setLoading(false);
            return;
        }

        const formDataObj = new FormData();
        formDataObj.append("title", formData.title);
        formDataObj.append("abstract", formData.abstract);

        // Process authors as array
        const authorNames = formData.authors
            .split(",")
            .map((name) => name.trim())
            .filter(Boolean);

        if (authorNames.length === 0) {
            setError("Please enter at least one author name.");
            setLoading(false);
            return;
        }

        // Convert authors array to a JSON string and append it as a single field
        formDataObj.append("authors", JSON.stringify(authorNames));

        // Process keywords as array
        const keywords = formData.keywords
            .split(",")
            .map((kw) => kw.trim())
            .filter(Boolean);

        // Convert keywords array to a JSON string and append it as a single field
        formDataObj.append("keywords", JSON.stringify(keywords));

        // Append both file types
        formDataObj.append("pdfFile", pdfFile);
        formDataObj.append("docxFile", docxFile);

        try {
            // Preferred approach: direct-to-Cloudinary browser upload to avoid streaming files through Render
            // 1) Request an upload signature/metadata from backend
            const sigResp = await api.get('/journals/upload-signature');
            const sig = sigResp.data;

            if (!sig || !sig.signature) {
                throw new Error('Failed to obtain Cloudinary signature');
            }

            // Helper to upload a single file to Cloudinary
            const uploadToCloudinary = async (file, folder, signaturePayload) => {
                const form = new FormData();
                form.append('file', file);
                form.append('api_key', signaturePayload.apiKey || '');
                form.append('timestamp', signaturePayload.timestamp);
                form.append('signature', signaturePayload.signature);
                if (signaturePayload.folder) form.append('folder', signaturePayload.folder);
                // Use raw upload endpoint
                const uploadUrl = signaturePayload.uploadUrl;

                const resp = await fetch(uploadUrl, {
                    method: 'POST',
                    body: form
                });

                if (!resp.ok) {
                    const text = await resp.text().catch(() => '');
                    throw new Error(`Cloudinary upload failed: ${resp.status} ${text}`);
                }

                const data = await resp.json();
                return data;
            };

            // Perform uploads in parallel
            const signaturePayload = sig;
            const uploads = {};
            const uploadPromises = [];

            uploadPromises.push(
                uploadToCloudinary(pdfFile, signaturePayload.folder, signaturePayload)
                    .then(data => { uploads.pdf = data; })
            );

            uploadPromises.push(
                uploadToCloudinary(docxFile, signaturePayload.folder, signaturePayload)
                    .then(data => { uploads.docx = data; })
            );

            await Promise.all(uploadPromises);

            console.log('Direct Cloudinary uploads completed:', uploads);

            // 2) Inform backend to create Journal record from Cloudinary metadata
            // Send JSON body to backend (Express parses JSON, multipart would leave req.body empty)
            const body = {
                title: formData.title,
                abstract: formData.abstract,
                authors: authorNames,
                keywords: keywords,
                docxCloudinaryUrl: uploads.docx?.secure_url || '',
                pdfCloudinaryUrl: uploads.pdf?.secure_url || '',
                docxFileId: uploads.docx?.public_id || '',
                pdfFileId: uploads.pdf?.public_id || ''
            };

            const createResp = await api.post('/journals/from-cloudinary', body);

            if (!createResp.data) throw new Error('Failed to create journal record');

            // Show Cloudinary URLs and copy buttons
            setSuccess('Journal uploaded successfully! Cloudinary URLs are shown below.');
            setCloudinaryUrls({
                pdf: uploads.pdf?.secure_url || null,
                docx: uploads.docx?.secure_url || null,
                pdfId: uploads.pdf?.public_id || null,
                docxId: uploads.docx?.public_id || null
            });

            resetForm();

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(""), 5000);
        } catch (err) {
            let errorMsg = "Failed to upload journal";

            if (err.response) {
                errorMsg = err.response.data?.message || "Server error occurred";
            } else if (err.request) {
                errorMsg = "Network error - unable to reach server";
            } else {
                errorMsg = err.message || "Error uploading journal";
            }

            setError(errorMsg);

            // Scroll to top to show error message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ title: "", abstract: "", authors: "", keywords: "" });
        setPdfFile(null);
        setDocxFile(null);
        setPdfFileName("");
        setDocxFileName("");

        // Reset file inputs if they exist
        const pdfInput = document.getElementById("pdfFileInput");
        const docxInput = document.getElementById("docxFileInput");

        if (pdfInput) pdfInput.value = "";
        if (docxInput) docxInput.value = "";
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-grow bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <div className="flex justify-between items-center mb-8">
<h2 className="text-2xl font-bold text-gray-800">Upload Article to International Journal of Innovative Research in Science Technology and Mathematics Education (IJIRSTME)</h2>
                                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                    Academic Publishing
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md animate-fade-in">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {success && (
                                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md animate-fade-in">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-green-700">{success}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Progress indicator (optional for future multi-step form) */}
                                <div className="progress-bar">
                                    <div className="progress-bar-filled" style={{ width: "100%" }}></div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Title <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter journal title"
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Abstract <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                name="abstract"
                                                value={formData.abstract}
                                                onChange={handleChange}
                                                required
                                                rows={4}
                                                placeholder="Provide a brief summary of your journal"
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Authors <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="authors"
                                                value={formData.authors}
                                                onChange={handleChange}
                                                required
                                                placeholder="e.g., John Smith, Jane Doe"
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Enter author names separated by commas.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Keywords
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="keywords"
                                                value={formData.keywords}
                                                onChange={handleChange}
                                                placeholder="e.g., science, research, medicine"
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Enter keywords separated by commas.
                                        </p>
                                    </div>

                                    {/* PDF File Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Upload PDF Document (.pdf) <span className="text-red-500">*</span>
                                        </label>
                                        <div
                                            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${pdfDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} border-dashed rounded-md`}
                                            onDragEnter={handlePdfDrag}
                                            onDragLeave={handlePdfDrag}
                                            onDragOver={handlePdfDrag}
                                            onDrop={handlePdfDrop}
                                        >
                                            <div className="space-y-1 text-center">
                                                {!pdfFileName ? (
                                                    <>
                                                        <svg
                                                            className="mx-auto h-12 w-12 text-gray-400"
                                                            stroke="currentColor"
                                                            fill="none"
                                                            viewBox="0 0 48 48"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                        <div className="flex text-sm text-gray-600 justify-center">
                                                            <label
                                                                htmlFor="pdfFileInput"
                                                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                                            >
                                                                <span>Upload a PDF file</span>
                                                                <input
                                                                    id="pdfFileInput"
                                                                    name="pdfFile"
                                                                    type="file"
                                                                    accept=".pdf"
                                                                    onChange={handlePdfFileChange}
                                                                    className="sr-only"
                                                                    required
                                                                />
                                                            </label>
                                                            <p className="pl-1">or drag and drop</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500">PDF up to 10MB</p>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <p className="mt-2 text-sm text-blue-600 font-medium">{pdfFileName}</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setPdfFile(null);
                                                                setPdfFileName("");
                                                                document.getElementById("pdfFileInput").value = "";
                                                            }}
                                                            className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* DOCX File Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Upload Word Document (.docx) <span className="text-red-500">*</span>
                                        </label>
                                        <div
                                            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${docxDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} border-dashed rounded-md`}
                                            onDragEnter={handleDocxDrag}
                                            onDragLeave={handleDocxDrag}
                                            onDragOver={handleDocxDrag}
                                            onDrop={handleDocxDrop}
                                        >
                                            <div className="space-y-1 text-center">
                                                {!docxFileName ? (
                                                    <>
                                                        <svg
                                                            className="mx-auto h-12 w-12 text-gray-400"
                                                            stroke="currentColor"
                                                            fill="none"
                                                            viewBox="0 0 48 48"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                        <div className="flex text-sm text-gray-600 justify-center">
                                                            <label
                                                                htmlFor="docxFileInput"
                                                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                                            >
                                                                <span>Upload a Word file</span>
                                                                <input
                                                                    id="docxFileInput"
                                                                    name="docxFile"
                                                                    type="file"
                                                                    accept=".docx"
                                                                    onChange={handleDocxFileChange}
                                                                    className="sr-only"
                                                                    required
                                                                />
                                                            </label>
                                                            <p className="pl-1">or drag and drop</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500">DOCX up to 10MB</p>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <p className="mt-2 text-sm text-blue-600 font-medium">{docxFileName}</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setDocxFile(null);
                                                                setDocxFileName("");
                                                                document.getElementById("docxFileInput").value = "";
                                                            }}
                                                            className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Please upload both PDF and Word versions of your document. The PDF will be used for display, while the Word document allows for better editing and formatting.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-5 border-t border-gray-200">
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                                loading ? "opacity-70 cursor-not-allowed" : ""
                                            }`}
                                        >
                                            {loading ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Uploading...
                                                </span>
                                            ) : (
                                                "Upload Journal"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {cloudinaryUrls.pdf || cloudinaryUrls.docx ? (
                                <div className="mt-6 p-4 bg-gray-50 border rounded">
                                    <h3 className="font-semibold mb-2">Cloudinary upload results</h3>
                                    {cloudinaryUrls.pdf && (
                                        <div className="mb-2">
                                            <div className="text-sm text-gray-700">PDF URL</div>
                                            <div className="flex items-center">
                                                <input className="flex-1 p-2 border rounded" value={cloudinaryUrls.pdf} readOnly />
                                                <button
                                                    className="ml-2 p-2 bg-blue-600 text-white rounded"
                                                    onClick={async () => {
                                                        try {
                                                            await navigator.clipboard.writeText(cloudinaryUrls.pdf);
                                                            toast.success('PDF URL copied to clipboard');
                                                        } catch (e) {
                                                            console.error('Copy failed', e);
                                                            toast.error('Failed to copy URL');
                                                        }
                                                    }}
                                                >Copy</button>
                                            </div>
                                            <div className="text-xs text-gray-500">Public ID: {cloudinaryUrls.pdfId}</div>
                                        </div>
                                    )}
                                    {cloudinaryUrls.docx && (
                                        <div>
                                            <div className="text-sm text-gray-700">DOCX URL</div>
                                            <div className="flex items-center">
                                                <input className="flex-1 p-2 border rounded" value={cloudinaryUrls.docx} readOnly />
                                                <button
                                                    className="ml-2 p-2 bg-blue-600 text-white rounded"
                                                    onClick={async () => {
                                                        try {
                                                            await navigator.clipboard.writeText(cloudinaryUrls.docx);
                                                            toast.success('DOCX URL copied to clipboard');
                                                        } catch (e) {
                                                            console.error('Copy failed', e);
                                                            toast.error('Failed to copy URL');
                                                        }
                                                    }}
                                                >Copy</button>
                                            </div>
                                            <div className="text-xs text-gray-500">Public ID: {cloudinaryUrls.docxId}</div>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </main>

            
        </div>
    );
};

export default JournalUpload;
