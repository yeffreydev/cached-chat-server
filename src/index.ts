import app from "./app";
import serverConfig from "./config/config";

app.listen(serverConfig.port, () => {
  console.log("server runnig at http://localhost:" + serverConfig.port);
});
