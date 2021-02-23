import app from "./app";
import config from "config";
import * as http from "http";
const port = config.get("app.server.port");
const host = "localhost";

http.createServer(app).listen(port, () => {
  console.info(`Hola, estoy en el puerto %d (http://${host}:%d)`, port, port);
});

