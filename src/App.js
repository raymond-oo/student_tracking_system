// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './Home';
import Login from './Login';
import ViewStudents from './ViewStudents';
import MyAccount from './MyAccount';
import ProtectedRoute from './components/ProtectedRoute';
import EditRecords from './EditRecords';
import AdminRoute from './components/AdminRoute';
import AddStudent from './Students/AddStudent';
import UpdateStudent from './Students/UpdateStudent';
import StudentProfile from './Students/StudentProfile';
import { Toaster } from 'react-hot-toast';

function App() {
    
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <Toaster />
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
                    <Route path="/view-students" element={<ProtectedRoute> <ViewStudents /></ProtectedRoute>} />
                    <Route path="/student/:id" element={<ProtectedRoute> <StudentProfile /></ProtectedRoute>} />
                    <Route 
                    path="/edit-records" 
                    element={
                        <ProtectedRoute>
                            <AdminRoute>
                                <EditRecords />
                            </AdminRoute>
                        </ProtectedRoute>
                    } 
                />
                    <Route 
                    path="/add-student" 
                    element={
                        <ProtectedRoute>
                            <AdminRoute>
                                <AddStudent />
                            </AdminRoute>
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/update-student/:id" 
                    element={
                        <ProtectedRoute>
                            <AdminRoute>
                                <UpdateStudent />
                            </AdminRoute>
                        </ProtectedRoute>
                    } 
                />
                    <Route path="/my-account" element={<ProtectedRoute> <MyAccount /> </ProtectedRoute>} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
