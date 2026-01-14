// import { TestCases } from "../types/testCases";
import { PYTHON_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

async function runPython(code: string){
    const runCommand=`python3 -c '${code.replace(/'/g,`'\\"`)}'`;
    console.log(runCommand);
    const pythonDockerContainer=await createContainer(PYTHON_IMAGE,['/bin/sh','-c',runCommand]);

    // starting/booting the corresponding docker container
    await pythonDockerContainer.start();

    const loggerStream=await pythonDockerContainer.logs({
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
    pythonDockerContainer.remove();
}

export default runPython; 