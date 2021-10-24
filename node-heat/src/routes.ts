import { Router } from "express";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { GetLast3MessagesController } from "./controllers/GetLast3MessagesController";
import { ProfileUserController } from "./controllers/ProfileUserController";
import { ensureAuthenticated } from "./middleware/ensureAuthenticated";

const router = Router();

// cria a rota para acontecer toda a requisição do access_token
// não precisa passar request,response pq vai ser passado como middleware e já recebe automaticamente
router.post("/authenticate", new AuthenticateUserController().handle);

// na criação da mensagem verifica se o usuário é autenticado a criar uma mensagem
router.post(
   "/messages",
   ensureAuthenticated,
   new CreateMessageController().handle
);

// rota que retorna as 3 utimas mensagens
router.get("/messages/last3", new GetLast3MessagesController().handle);

// rota que retorna os dados do completos do usuário que requisitar
router.get("/profile", ensureAuthenticated, new ProfileUserController().handle);

export { router };
