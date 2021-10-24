//
import prismaClient from "../prisma";

class GetLast3MessagesService {
   async execute() {
      // vai pegar as 3 ultimas mensagens do banco de dados
      const messages = await prismaClient.message.findMany({
         // take- limite de dados no caso apenas 3
         take: 3,
         // orderna do último created_at para o primeiro, ai pega os 3 últimos
         orderBy: {
            created_at: "desc",
         },
         // trazer as informações do usuário que criou
         include: {
            user: true,
         },
      });

      // SELETE * FROM MESSAGE LIMIT 3 ORDER BY CREATED_AD DESC
      return messages;
   }
}

export { GetLast3MessagesService };
