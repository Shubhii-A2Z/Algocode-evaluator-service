// import { TestCases } from "../types/testCases";
import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

async function runJava(code: string, inputTestCase: string){
    const runCommand=`echo '${code.replace(/'/g,`'\\"`)}' > Main.java && echo javac Main.java && echo '${inputTestCase.replace(/'/g,`'\\"`)}' | java main`;
    console.log(runCommand);
    const javaDockerContainer=await createContainer(JAVA_IMAGE,['/bin/sh','-c',runCommand]);

    // starting/booting the corresponding docker container
    await javaDockerContainer.start();

    const loggerStream=await javaDockerContainer.logs({
        stdout: true,
        stderr: true,
        timestamps: false, 
        follow: true 
    });

    // attach events on the stream objects to start and stop reading
    const rawLogBuffer: Buffer[]=[];
    loggerStream.on('data',(chunk)=>{
        rawLogBuffer.push(chunk); // reading data chunk-by-chunk
    });

    await new Promise((res)=>{
            loggerStream.on('end',()=>{
            console.log(rawLogBuffer);
            const completeBuffer=Buffer.concat(rawLogBuffer);
            const decodedStream=decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            console.log(decodedStream.stdout);
            res(decodeDockerStream);
        });
    });

    // removing the container when done with it
    javaDockerContainer.remove();
}

export default runJava; 