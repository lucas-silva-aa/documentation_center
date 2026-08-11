import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

const PrivateGestorRoute: React.FC<RouteProps> = ({ component: Component, ...rest }) => {
    const nivel = parseInt(localStorage.getItem('nivelAcesso') || '1');
    const isLoggedIn = !!localStorage.getItem('login');

    return (
        <Route
            {...rest}
            render={props => {
                if (!isLoggedIn) return <Redirect to="/login" />;
                if (nivel < 2) return <Redirect to="/" />;
                return Component ? <Component {...props} /> : null;
            }}
        />
    );
};

export default PrivateGestorRoute;
