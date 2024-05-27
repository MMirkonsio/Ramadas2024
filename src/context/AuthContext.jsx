import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase/supabase.config";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const AuthContextProvider = ({children}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    async function handleSignInWithGoogle(response) {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
              })
        
            if(error) throw Error("Error durante el inicio");
            return data;
        } catch (error) {
            console.log(error);
            
        }
        
      }
    
    async function handleSignOut() {
        const { error } = await supabase.auth.signOut();
        if(error) throw Error("Error durante el inicio");
    }

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("evento:", session);
            if(session==null){
                navigate("/login", { replace: true });
                
            }
            else{
                setUser(session?.user || null);
                navigate("/", { replace: true });
            }
        });
        return () =>{
            authListener.subscription;
        }
      }, []);
    
    return (
        <AuthContext.Provider value={{user, setUser, handleSignInWithGoogle, handleSignOut}}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext (AuthContext);
}