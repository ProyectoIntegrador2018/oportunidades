import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, redirectTo, path, ...props }) => {
    const isAuth = sessionStorage.getItem('AUTHENTICATED');
    if(!isAuth) {
        return <Navigate to={redirectTo} />;
    }
    return <Route path={path} element={<Component />} />
};

export {ProtectedRoute};