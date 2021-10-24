import "dotenv/config";
import express from "express";
import { router } from "./routes";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
const app = express();
// faz com que o express aceite requisições com tipo json
app.use(express.json());

// habilita e inicia o cors em qualquer rota ou requisição ao servidor.
// cors é responsável de permitir ou barrar as requisições ao nosso servidor
app.use(cors());
// passa a iniciar o server com http porém quando iniciado ele inicia o app junto
const serverHttp = http.createServer(app);
// io faz com que conseguimos se conectar com o io do client
const io = new Server(serverHttp, {
   cors: {
      // permite que outras fontes (front-end, mobile) se conectem tanto com o http quanto o websocket
      origin: "*",
   },
});

// io.on consegue passar/emitir quanto escutar um evento dentro do web socket
// nesse caso ficar ouvindo se algum cliente se conectou a nossa aplicação
// dentro do client precisa existir um socket instanciado para fazer essa troca de informação e conexão
io.on("connection", (socket) => {
   console.log(`Usuário conectado no socket ${socket.id}`);
});

app.use(router);

// redireciona para github para receber autorização se ler os dados do usuário
app.get("/github", (request, response) => {
   response.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
   );
});

app.get("/signin/callback", (request, response) => {
   const { code } = request.query;
   return response.json(code);
});
// o serverHttp que vai iniciar o servidor agora
export { serverHttp, io };
