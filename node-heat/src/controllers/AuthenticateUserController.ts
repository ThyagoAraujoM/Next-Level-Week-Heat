import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUserService";

class AuthenticateUserController {
   async handle(request: Request, response: Response) {
      // pega o código que vai vir do body do AuthenticateUserService
      const { code } = request.body;

      const service = new AuthenticateUserService();

      // trata o erro do código para avisar se é válido ou não
      try {
         const result = await service.execute(code);
         // passa o código como resultado
         return response.json(result);
      } catch (err) {
         return response.json(err.message);
      }
   }
}

export { AuthenticateUserController };
