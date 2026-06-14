import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Borrowers from "./pages/Borrowers"
import BorrowerProfile from "./pages/BorrowerProfile"
import AddBorrower from "./pages/AddBorrower"
import AddLoan from "./pages/AddLoan"
import NotFound from "./pages/NotFound"

function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                <Route path="/borrowers" element={
                    <ProtectedRoute>
                        <Borrowers />
                    </ProtectedRoute>
                } />

                <Route path="/borrowers/new" element={
                    <ProtectedRoute>
                        <AddBorrower />
                    </ProtectedRoute>
                } />

                <Route path="/borrowers/:id" element={
                    <ProtectedRoute>
                        <BorrowerProfile />
                    </ProtectedRoute>
                } />

                <Route path="/borrowers/:id/add-loan" element={
                    <ProtectedRoute>
                        <AddLoan />
                    </ProtectedRoute>
                } />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App