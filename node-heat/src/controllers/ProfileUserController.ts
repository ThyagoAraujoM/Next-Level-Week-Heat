import { Request, Response } from "express";
import { GetLast3MessagesService } from "../services/GetLast3MEssageService";
import { ProfileUserService } from "../services/ProfileUserService";

class ProfileUserController {
   async handle(request: Request, response: Response) {
      const { user_id } = request;

      const service = new ProfileUserService();
      // passa o user_id e recebe os dados completos do usuário
      const result = await service.execute(user_id);

      return response.json(result);
   }
}

export { ProfileUserController };
