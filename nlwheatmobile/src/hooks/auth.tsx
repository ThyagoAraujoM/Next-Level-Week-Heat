import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSessions from "expo-auth-session";
import { api } from "../services/api";
const CLIENT_ID = "b30f8e8f5a6e0a6f2714";
const SCOPE = "read:user";
// o asyncstorage armazena dados baseados em chave valor. As chaves sendo os dois abaixo
const USER_STORAGE = "@nlwheat:user";
const TOKEN_STORAGE = "@nlwheat:token";

type User = {
   id: string;
   avatar_url: string;
   name: string;
   login: string;
};

type AuthContextData = {
   user: User | null;
   isSigningIn: boolean;
   signIn: () => Promise<void>;
   signOut: () => Promise<void>;
};
type AuthProviderProps = {
   children: React.ReactNode;
};
type AuthResponse = { token: string; user: User };

type AuthorizationResponse = {
   params: {
      code?: string;
      error?: string;
   };
   type?: string;
};

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
   const [isSigningIn, setIsSigningIn] = useState(true);
   const [user, setUser] = useState<User | null>(null);

   async function signIn() {
      try {
         setIsSigningIn(true);
         const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;
         // recebe o token de autorização por parametros após o retorno do github autorizado
         const authSessionResponse = (await AuthSessions.startAsync({
            authUrl,
         })) as AuthorizationResponse;

         if (
            authSessionResponse.type === "success" &&
            authSessionResponse.params.error !== "access_denied"
         ) {
            const authResponse = await api.post("/authenticate", {
               code: authSessionResponse.params.code,
            });
            const { user, token } = authResponse.data as AuthResponse;
            // faz com que toda a requisição da api tenha um token do tipo Bearer com o token
            // para autorização
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            // salvando dados com a chave para tipo de dado
            await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
            await AsyncStorage.setItem(TOKEN_STORAGE, token);
            // salva as informações do usuário após fazer login
            setUser(user);
         }
      } catch (error) {
         console.log(error);
      } finally {
         setIsSigningIn(false);
      }
   }

   async function signOut() {
      setUser(null);
      await AsyncStorage.removeItem(USER_STORAGE);
      await AsyncStorage.removeItem(TOKEN_STORAGE);
   }
   //  busca os dados salvos do usuário caso ele tenha feito login na sessão anteiror
   useEffect(() => {
      async function loadUserStorageData() {
         const userStorage = await AsyncStorage.getItem(USER_STORAGE);
         const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);
         // se o usuário está autenticado já coloca em todas as requisições o token de autorização
         // e seta o usuário com o usuário salvo
         if (userStorage && tokenStorage) {
            api.defaults.headers.common[
               "Authorization"
            ] = `Bearer ${tokenStorage}`;
            setUser(JSON.parse(userStorage));
         }
         // toda vez que o usuário abrir a aplicação, diz que ele está logado porém quando passar na verificação e não estiver
         // passa a ser falso
         setIsSigningIn(false);
      }
      loadUserStorageData();
   }, []);

   return (
      <AuthContext.Provider value={{ signIn, signOut, user, isSigningIn }}>
         {children}
      </AuthContext.Provider>
   );
}

function useAuth() {
   const context = useContext(AuthContext);
   return context;
}

export { AuthProvider, useAuth };
