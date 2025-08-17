// Frontend security utilities

// XSS Protection - Sanitize HTML content
export const sanitizeHtml = (html) => {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
};

// Input validation helpers
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
};

export const validatePassword = (password) => {
    return password && 
           password.length >= 6 && 
           password.length <= 128 &&
           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
};

export const validateName = (name) => {
    return name && 
           name.length >= 2 && 
           name.length <= 50 &&
           /^[a-zA-Z\s'-]+$/.test(name);
};

// Secure token storage (use sessionStorage instead of localStorage for better security)
export const tokenStorage = {
    set: (token) => {
        if (token) {
            sessionStorage.setItem('authToken', token);
            // Also set a flag to indicate user is authenticated
            sessionStorage.setItem('isAuthenticated', 'true');
        }
    },
    
    get: () => {
        return sessionStorage.getItem('authToken');
    },
    
    remove: () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('authUser');
    },
    
    isAuthenticated: () => {
        return sessionStorage.getItem('isAuthenticated') === 'true' && 
               sessionStorage.getItem('authToken') !== null;
    }
};

// User data storage
export const userStorage = {
    set: (user) => {
        if (user) {
            sessionStorage.setItem('authUser', JSON.stringify(user));
        }
    },
    
    get: () => {
        const user = sessionStorage.getItem('authUser');
        try {
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    },
    
    remove: () => {
        sessionStorage.removeItem('authUser');
    }
};

// CSRF Protection - Generate and validate CSRF tokens
export const csrfProtection = {
    generateToken: () => {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },
    
    setToken: (token) => {
        sessionStorage.setItem('csrfToken', token);
    },
    
    getToken: () => {
        return sessionStorage.getItem('csrfToken');
    },
    
    removeToken: () => {
        sessionStorage.removeItem('csrfToken');
    }
};

// Content Security Policy helpers
export const cspHelpers = {
    // Check if a URL is safe to load
    isSafeUrl: (url) => {
        try {
            const urlObj = new URL(url);
            const allowedDomains = [
                'localhost',
                'njostemejournal.com.ng',
                'coels-n-internal-journal-frontend.vercel.app',
                'res.cloudinary.com',
                'fonts.googleapis.com',
                'fonts.gstatic.com'
            ];
            
            return allowedDomains.some(domain => 
                urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
            );
        } catch (error) {
            return false;
        }
    },
    
    // Sanitize URLs
    sanitizeUrl: (url) => {
        if (!url) return '';
        
        // Remove javascript: and data: URLs
        if (url.toLowerCase().startsWith('javascript:') || 
            url.toLowerCase().startsWith('data:')) {
            return '';
        }
        
        return url;
    }
};

// File upload security
export const fileUploadSecurity = {
    // Validate file type
    isValidFileType: (file) => {
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'application/msword', // .doc
            'application/pdf'
        ];
        
        return allowedTypes.includes(file.type);
    },
    
    // Validate file size (10MB max)
    isValidFileSize: (file) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        return file.size <= maxSize;
    },
    
    // Validate file name
    isValidFileName: (fileName) => {
        // Check for dangerous extensions
        const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.js', '.jar'];
        const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
        
        if (dangerousExtensions.includes(fileExtension)) {
            return false;
        }
        
        // Check for path traversal attempts
        if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
            return false;
        }
        
        return true;
    },
    
    // Comprehensive file validation
    validateFile: (file) => {
        const errors = [];
        
        if (!file) {
            errors.push('No file selected');
            return { isValid: false, errors };
        }
        
        if (!fileUploadSecurity.isValidFileType(file)) {
            errors.push('Invalid file type. Only DOCX, DOC, and PDF files are allowed.');
        }
        
        if (!fileUploadSecurity.isValidFileSize(file)) {
            errors.push('File too large. Maximum size is 10MB.');
        }
        
        if (!fileUploadSecurity.isValidFileName(file.name)) {
            errors.push('Invalid file name or potentially dangerous file.');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

// Rate limiting removed - no longer using client-side rate limiting

// Security event logging
export const securityLogger = {
    log: (event, details = {}) => {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event,
            details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console.warn('Security Event:', logEntry);
        
        // In production, you might want to send this to a logging service
        if (process.env.NODE_ENV === 'production') {
            // Send to logging service
        }
    }
};

export default {
    sanitizeHtml,
    validateEmail,
    validatePassword,
    validateName,
    tokenStorage,
    userStorage,
    csrfProtection,
    cspHelpers,
    fileUploadSecurity,
    securityLogger
};
