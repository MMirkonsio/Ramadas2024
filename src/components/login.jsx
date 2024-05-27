import { UserAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";


const Login = () => {
    const { handleSignInWithGoogle } = UserAuth();

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md text-center">
                <p className="text-blue-500 text-5xl font-bold">Ramadas</p>
                <p className="text-red-500 text-5xl font-bold ml-1">2024</p>
                <button
                    onClick={handleSignInWithGoogle}
                    className="bg-neutral-900 hover:bg-neutral-700 font-medium text-white py-2 px-4 rounded flex flex-row gap-2 items-center mt-4"
                    
                >
                    Iniciar sesión con <FcGoogle style={{ fontSize: '2rem' }}/>                    
                </button>
            </div>
        </div>
    );
};

export default Login;
