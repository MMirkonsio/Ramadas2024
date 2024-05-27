import { UserAuth } from "../context/AuthContext";
import React from 'react';

const Login = () => {
    const { handleSignInWithGoogle } = UserAuth();

    return (
        <div className="login-container">
            <h1>Iniciar Sesión</h1>
            <button
                onClick={handleSignInWithGoogle}
                className="bg-red-500 hover:bg-red-700 text-white p-2 rounded"
            >
                Iniciar sesión con Google
            </button>
        </div>
    );
};

export default Login;
