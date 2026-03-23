
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageOrders from "./pages/ManageOrders";
import ManageProducts from "./pages/ManageProducts";
import AddService from "./pages/AddService";
import Sidebar from "./Components/Sidebar";
import ScrollProgress from "./Components/ScrollProgress";
import AdminLogin from "./pages/AdminLogin";
import EditService from "./pages/EditService";
import ManageQuotes from "./pages/ManageQuotes";

function ProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin");
  return isAdmin ? children : <Navigate to="/admin-login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <ScrollProgress />
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 min-h-screen">
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<ManageProducts />} />
                    <Route path="edit-service/:id" element={<EditService />} />
                    <Route path="orders" element={<ManageOrders />} />
                    <Route path="users" element={<ManageUsers />} />
                    <Route path="quotes" element={<ManageQuotes />}/>
                    <Route path="add-service" element={<AddService />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
