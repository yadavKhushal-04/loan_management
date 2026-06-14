import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Borrowers from "./pages/Borrowers"
import BorrowerProfile from "./pages/BorrowerProfile"
import NotFound from "./pages/NotFound"
import AddBorrower from "./pages/AddBorrower"

function App() {
    return (
        <BrowserRouter>
            {/* placing it at the root means
                toast notifications work on every page */}
            <Toaster position="top-right" />

            <Routes>
                {/* public route — no auth needed */}
                <Route path="/login" element={<Login />} />

                {/* protected routes — redirect to login if not authenticated */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                <Route path="/borrowers/new" element={
                    <ProtectedRoute>
                        <AddBorrower />
                    </ProtectedRoute>
                } />

                <Route path="/borrowers" element={
                    <ProtectedRoute>
                        <Borrowers />
                    </ProtectedRoute>
                } />

                <Route path="/borrowers/:id" element={
                    <ProtectedRoute>
                        <BorrowerProfile />
                    </ProtectedRoute>
                } />

                {/* redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* catch all unmatched routes */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App