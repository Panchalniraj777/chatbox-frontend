import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './Components/Pages/SignUp';
import SignIn from './Components/Pages/SignIn';
import Chat from './Components/Pages/Chat';

export const AuthContext = createContext({
    isAuthenticated: false,
    handleLogin: () => {},
    handleLogout: () => {},
});

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage?.getItem('isLoggedIn') || false
    );

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
    };

    const PrivateRoute = ({ children }) => {
        const context = useContext(AuthContext);
        if (!context.isAuthenticated) {
            return <Navigate to="/sign-in" />;
        }
        return children;
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, handleLogin, handleLogout }}>
            <Router>
                <Routes>
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Chat />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
