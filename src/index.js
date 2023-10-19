import env from "./env.js";
import { app } from "./app.js";

app.listen(env.PORT, () => {
  console.log(`Servidor Node.js em execução na porta ${env.PORT}`);
});
