import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
const { currentUser, userRole, loading } = useAuth();

if (loading) {
return <h2>Loading RE:SOURCE...</h2>;
}

if (!currentUser) {
return <Navigate to="/login" replace />;
}

// Apply role restrictions only when explicitly requested.
if (allowedRoles && !allowedRoles.includes(userRole)) {
return <Navigate to="/" replace />;
}

return children;
}

export default ProtectedRoute;
