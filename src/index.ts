import express from "express";
import bodyParser from "body-parser";

import serverConfig from "./config/server.config";
import apiRouter from "./routes";
// import runPython from "./containers/runPythonDocker";
import sampleWorker from "./workers/sampleWorkers";
// import runJava from "./containers/runJavaDocker";
import runCpp from "./containers/runCppDocker";
import SubmissionWorker from "./workers/submissionWorker";

const app=express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use('/api',apiRouter);

app.listen(serverConfig.PORT,()=>{
    console.log(`The Server is ready at port ${serverConfig.PORT}`);

    sampleWorker('SampleQueue');
    SubmissionWorker('SubmissionQueue');

    const code=`
    #include <bits/stdc++.h>
    using namespace std;

    int main(){
        int x; cin>>x;
        cout<<"Value of x is: "<<x<<endl;
        for(int i=0;i<x;++i){
            cout<<i<<endl;
        }
        cout<<endl;
        return 0;
    }
    `;

    const inputTestCase='10';
    runCpp(code,inputTestCase);
});