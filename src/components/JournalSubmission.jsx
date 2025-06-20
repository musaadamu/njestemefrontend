import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './JournalSubmission.css';

// Determine API base URL based on environment and available URLs
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                    (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 
                     'https://coelsn-backend.onrender.com');

const JournalSubmission = () => {
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      console.log('File dropped:', acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      abstract: '',
      keywords: '',
      authors: '',
      uploadFile: null
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      abstract: Yup.string().required('Abstract is required'),
      keywords: Yup.string().required('Keywords are required'),
      authors: Yup.string().required('Authors are required')
    }),
    onSubmit: async (values, { resetForm }) => {
      const selectedFile = file || values.uploadFile;

      if (!selectedFile) {
        toast.error('Please upload a .docx file');
        return;
      }

      setLoading(true);
      setSuccess(false);

      try {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('abstract', values.abstract);
        formData.append('keywords', JSON.stringify(values.keywords.split(',').map(k => k.trim())));
        formData.append('authors', JSON.stringify(values.authors.split(',').map(a => a.trim())));
        formData.append('file', selectedFile);

        const endpoint = API_BASE_URL.includes('/api') ? '/submissions' : '/api/submissions';
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000
        });

        if (response.status === 201 || response.status === 200) {
          toast.success('Journal submitted successfully');
          resetForm();
          setFile(null);
          setSuccess(true);
        } else {
          throw new Error('Unexpected server response');
        }
      } catch (err) {
        console.error('Submission error:', err);
        let errorMessage = 'Submission failed. Please try again.';

        if (err.response) {
          errorMessage = err.response.data?.message || errorMessage;
        } else if (err.request) {
          errorMessage = 'Network error. Please check your connection.';
        }

        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  });

  const handleFileChange = (event) => {
    const selectedFile = event.currentTarget.files[0];
    if (selectedFile) {
      formik.setFieldValue('uploadFile', selectedFile);
      setFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="journal-submission-container max-w-4xl mx-auto">
<h2 className="text-2xl font-bold mb-6">Submit Your Article to International Journal of Innovative Research in Science Technology and Mathematics Education (IJIRSTME)</h2>

          <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <input
              type="text"
              name="title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              placeholder="Title"
              className="w-full p-2 border rounded-md mb-2"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm mb-2">{formik.errors.title}</p>
            )}

            <textarea
              name="abstract"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.abstract}
              placeholder="Abstract"
              className="w-full p-2 border rounded-md h-32 mb-2"
            />
            {formik.touched.abstract && formik.errors.abstract && (
              <p className="text-red-500 text-sm mb-2">{formik.errors.abstract}</p>
            )}

            <input
              type="text"
              name="keywords"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.keywords}
              placeholder="Keywords (comma-separated)"
              className="w-full p-2 border rounded-md mb-2"
            />
            {formik.touched.keywords && formik.errors.keywords && (
              <p className="text-red-500 text-sm mb-2">{formik.errors.keywords}</p>
            )}

            <input
              type="text"
              name="authors"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.authors}
              placeholder="Authors (comma-separated)"
              className="w-full p-2 border rounded-md mb-2"
            />
            {formik.touched.authors && formik.errors.authors && (
              <p className="text-red-500 text-sm mb-2">{formik.errors.authors}</p>
            )}

            <div className="mb-4">
              <label className="block mb-1 text-gray-700 font-medium">Choose a .docx file</label>
              <input
                type="file"
                name="uploadFile"
                accept=".docx"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer mb-4 ${isDragActive ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
            >
              <input {...getInputProps()} />
              {file ? (
                <p className="text-green-600 font-semibold">{file.name}</p>
              ) : (
                <p className="text-gray-600">Drag and drop a .docx file here, or click to select</p>
              )}
            </div>

            {(file || formik.values.uploadFile) && (
              <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-green-700">
                  File selected: {file ? file.name : formik.values.uploadFile?.name}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mt-6 p-4 bg-green-100 text-green-700 rounded shadow"
              >
                🎉 Journal submitted successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default JournalSubmission;
