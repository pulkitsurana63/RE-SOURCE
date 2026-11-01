import {
BrowserRouter,
Routes,
Route,
Navigate
} from "react-router-dom";

// Dashboards
import SeekerDashboard from "./dashboards/SeekerDashboard";
import ProviderDashboard from "./dashboards/ProviderDashboard";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Donations from "./pages/Donations";
import ChooseAction from "./pages/ChooseAction";

// Authentication
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Global CSS
import "./styles/global.css";

function App() {
return ( <BrowserRouter> <AuthProvider> <Routes>

```
      {/* PUBLIC PAGES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PUBLIC DONATIONS */}
      <Route
        path="/donations"
        element={<Donations />}
      />

      {/* AUTHENTICATED USERS */}
      <Route
        path="/choose-action"
        element={
          <ProtectedRoute>
            <ChooseAction />
          </ProtectedRoute>
        }
      />

      {/* SEEKER DASHBOARD - ANY LOGGED-IN USER */}
      <Route
        path="/seeker"
        element={
          <ProtectedRoute>
            <SeekerDashboard />
          </ProtectedRoute>
        }
      />

      {/* PROVIDER DASHBOARD - ANY LOGGED-IN USER */}
      <Route
        path="/provider"
        element={
          <ProtectedRoute>
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />

      {/* UNKNOWN ROUTES */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  </AuthProvider>
</BrowserRouter>


);
}

export default App;
