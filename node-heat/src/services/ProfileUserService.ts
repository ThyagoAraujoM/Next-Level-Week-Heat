//
import prismaClient from "../prisma";

class ProfileUserService {
   async execute(user_id: string) {
      // vai pegar os dados do usuário que bater com o usuário_id passado
      const user = await prismaClient.user.findFirst({
         where: {
            id: user_id,
         },
      });

      return user;
   }
}

export { ProfileUserService };
