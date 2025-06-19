import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const LoadingSpinner = () => (
    <div className="loading-spinner">
        <span>Loading...</span>
    </div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useSelector((state) => state.auth);

    // Debug user role information
    console.log('Protected Route - User:', user);
    console.log('Protected Route - Allowed Roles:', allowedRoles);

    const isAuthorized = useMemo(() => {
    // Enhanced debug logging
    console.log('Protected Route Debug:', {
      user: user,
      allowedRoles: allowedRoles,
      hasUser: !!user,
      userRole: user?.role,
      userFromStorage: JSON.parse(localStorage.getItem('authUser'))
    });
    
    // If no roles are specified, allow access to authenticated users
    if (!allowedRoles || allowedRoles.length === 0) {
      console.log('No roles specified, allowing access');
      return true;
    }

    // If user has no role, deny access to role-restricted routes
    if (!user || !user.role) {
      console.log('No user or user role found, denying access');
      return false;
    }

    // Check if user's role is in the allowed roles
    const hasRole = allowedRoles.includes(user.role);
    console.log('Role check result:', {
      userRole: user.role,
      allowedRoles: allowedRoles,
      hasRole: hasRole
    });
    return hasRole;
    }, [user, allowedRoles]);

    if (loading) {
        return <LoadingSpinner />;
    }

    // If user is not logged in, redirect to login
    if (!user) {
        console.log('User not logged in, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    // If user doesn't have the required role, redirect to unauthorized
    if (!isAuthorized) {
        console.log('User not authorized, redirecting to unauthorized');
        return <Navigate to="/unauthorized" replace />;
    }

    // User is logged in and has the required role
    console.log('User authorized, rendering protected content');
    return children;
};

export default ProtectedRoute;
