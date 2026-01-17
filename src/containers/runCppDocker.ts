// import { TestCases } from "../types/testCases";
import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

async function runCpp(code: string, inputTestCase: string){
    const runCommand=`echo '${code.replace(/'/g,`'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g,`'\\"`)}' | stdbuf -oL -eL ./main`;
    console.log(runCommand);
    const cppDockerContainer=await createContainer(CPP_IMAGE,['/bin/sh','-c',runCommand]);

    // starting/booting the corresponding docker container
    await cppDockerContainer.start();

    const loggerStream=await cppDockerContainer.logs({
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
    cppDockerContainer.remove();
}

export default runCpp; 