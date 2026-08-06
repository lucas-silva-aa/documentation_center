import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

const PrivateRoute: React.FC<RouteProps> = ({ component: Component, ...rest }) => {
    const isLoggedIn = !!localStorage.getItem('login');
    return (
        <Route
            {...rest}
            render={props => {
                if (!isLoggedIn) return <Redirect to="/login" />;
                return Component ? <Component {...props} /> : null;
            }}
        />
    );
};

export default PrivateRoute;
