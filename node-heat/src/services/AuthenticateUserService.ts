import axios from "axios";
import prismaClient from "../prisma/";
import { sign } from "jsonwebtoken";

/*
 * - Receber code(string)
 * Recuperar o access_token no github
 * Recuperar infos do user no github
 * Verificar se o usuário existe no DB
 * ---- SIM = Gera um token
 * ---- NÃO = Cria no DB, gera um token
 *  Retornar o token com as infos do user
 *
 */

interface IAccessTokenResponse {
   access_token: string;
}

interface IUserResponde {
   avatar_url: string;
   login: string;
   id: number;
   name: string;
}

// manda uma requisição para o github com client_id e client_secret, github faz autenticação dos dados,
// se passar ele manda uma access_token para conseguirmos pegar informações de um usuário
// Depois disso vamos pegar as informações do usuário no github com o access_token que está utilizando a aplicação no momento
class AuthenticateUserService {
   async execute(code: string) {
      const url = "https://github.com/login/oauth/access_token";

      // utilizando a interface do typescript especifica o tipo de dado que você quer
      // receber da requisição e utilizando desestruturação pegamos apenas o data do tipo accessTokenResponse
      const { data: accessTokenResponse } =
         await axios.post<IAccessTokenResponse>(url, null, {
            params: {
               client_id: process.env.GITHUB_CLIENT_ID,
               client_secret: process.env.GITHUB_CLIENT_SECRET,
               code,
            },
            headers: { Accept: "application/json" },
         });

      // faz a busca de todas as informações do usuário que está logado na aplicação
      // passando o access_token que recebemos do github
      // IUserResponde é as informações que queremos da requisição, assim armazenando apenas o necessário
      const response = await axios.get<IUserResponde>(
         "https://api.github.com/user",
         {
            headers: {
               // Bearer foi o tipo de codificação que o Github passa com o access_token
               authorization: `Bearer ${accessTokenResponse.access_token}`,
            },
         }
      );

      // desestrutura os dados da response já pegando todas as informações do usuário.
      const { login, id, avatar_url, name } = response.data;

      // verifica no banco de dados se existe algum usuário com o msm id do usuário atual logado
      let user = await prismaClient.user.findFirst({
         where: { github_id: id },
      });

      // se não existe cria um passando as informações baseadas no model criado no prisma
      if (!user) {
         user = await prismaClient.user.create({
            data: {
               github_id: id,
               login,
               avatar_url,
               name,
            },
         });
      }

      // passa as informações que o usuário vai ter acesso
      const token = sign(
         {
            user: {
               name: user.name,
               avatar_url: user.avatar_url,
               id: user.id,
            },
         },
         // 1:10:00 secret para tanto criar quanto validar o usuário. Criado com hash md5
         process.env.JWT_SECRET,
         {
            subject: user.id,
            expiresIn: "1d",
         }
      );

      return { token, user };
   }
}
export { AuthenticateUserService };
