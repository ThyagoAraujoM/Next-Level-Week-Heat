//
import prismaClient from "../prisma";
// parar se comunicar e mandar para o cliente a mensagem que ele acavou de criar
import { io } from "../app";

class CreateMessageService {
   // text: mensagem que vai ser salva
   // user: usuário que vai mandar a mensagem
   async execute(text: string, user_id: string) {
      try {
         const message = await prismaClient.message.create({
            // datas para a criação da mensagem
            data: {
               text,
               user_id,
            },
            // passa o include para escolher o que quer ser incluído na criação da mensagem
            // No caso o usuário que criou essa mensagem
            include: {
               user: true,
            },
         });

         const infoWS = {
            text: message.text,
            user_id: message.user_id,
            created_at: message.created_at,
            user: {
               name: message.user.name,
               avatar_url: message.user.avatar_url,
            },
         };
         //Emite um evento que vai passar as informações da menssagem para o usuário.
         io.emit("new_message", infoWS);

         return message;
      } catch (error) {
         console.log(error);
      }
   }
}

export { CreateMessageService };
