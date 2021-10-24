import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";
export const AuthContext = createContext({} as AuthContextData);

type User = {
   id: string;
   name: string;
   login: string;
   avatar_url: string;
};

type AuthContextData = {
   user: User | null;
   signInUrl: string;
   signOut: () => void;
};

type AuthProvider = {
   // reactnode é qualquer coisa aceitável pelo react: text, component, elemento html etc....
   children: ReactNode;
};

type AuthResponse = {
   token: string;
   user: {
      id: string;
      avatar_url: string;
      name: string;
      login: string;
   };
};

// passando os dados como token do usuário para o children de AuthProvider no caso toda a aplicação
export function AuthProvider(props: AuthProvider) {
   const [user, setUser] = useState<User | null>(null);
   // scope é para especificar quais informações do usuário você quer,
   // quando se passa user é que vai retornar só as informações principais: nome,email e etc
   // client_id é o id que pegamos quando criado o oath no back
   const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=7a84465a2687f51ed4df`;

   async function singIn(githubCode: string) {
      const response = await api.post<AuthResponse>("authenticate", {
         code: githubCode,
      });
      const { token, user } = response.data;
      localStorage.setItem("@dowhile:token", token);

      api.defaults.headers.common.authorization = `Bearer ${token}`;
      setUser(user);
   }

   // função para desconectar o usuário atual
   function signOut() {
      setUser(null);
      localStorage.removeItem("@dowhile:token");
   }

   useEffect(() => {
      const token = localStorage.getItem("@dowhile:token");
      if (token) {
         // faz com que toda requisição que parta daqui pra frente vai ir junto com o token de autorização dentro do header
         // como default para autorizar o pedido do profile do usuário
         api.defaults.headers.common.authorization = `Bearer ${token}`;

         api.get<User>("profile").then((response) => {
            setUser(response.data);
         });
      }
   }, []);

   useEffect(() => {
      const url = window.location.href;
      const hasGithubCode = url.includes("?code=");

      if (hasGithubCode) {
         const [urlWithoutCode, githubCode] = url.split("?code=");

         // limpa o url do usuário para ele não ver o código sendo recebido
         window.history.pushState({}, "", urlWithoutCode);

         singIn(githubCode);
      }
   }, []);

   return (
      <AuthContext.Provider value={{ signInUrl, user, signOut }}>
         {props.children}
      </AuthContext.Provider>
   );
}
