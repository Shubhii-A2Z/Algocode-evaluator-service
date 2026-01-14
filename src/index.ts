import express from "express";
import bodyParser from "body-parser";

import serverConfig from "./config/server.config";
import apiRouter from "./routes";
import runPython from "./containers/runPythonDocker";
import sampleWorker from "./workers/sampleWorkers";

const app=express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use('/api',apiRouter);

app.listen(serverConfig.PORT,()=>{
    console.log(`The Server is ready at port ${serverConfig.PORT}`);
    sampleWorker('SampleQueue');
    const code=`print("hello")`;
    runPython(code);
});