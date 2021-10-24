import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
   sub: string;
}

export function ensureAuthenticated(
   req: Request,
   res: Response,
   next: NextFunction
) {
   const authToken = req.headers.authorization;

   if (!authToken) {
      return res.status(401).json({
         erroCode: "token.invalid",
      });
   }

   //Bearer 18u418745612498
   // [0] Bearer
   // [1] 18u418745612498

   // , pula um valor no caso 0 e só guarda o próximo
   const [, token] = authToken.split(" ");

   try {
      // verifica se o token passado é valido baseado no JWT_SECRET, que é utilizado na criação do token
      // verificado pega o sub que é o id do usuário
      const { sub } = verify(token, process.env.JWT_SECRET) as IPayload;
      req.user_id = sub;

      return next();
   } catch (error) {
      return res.status(401).json({ errorCode: "token.expired" });
   }
}
