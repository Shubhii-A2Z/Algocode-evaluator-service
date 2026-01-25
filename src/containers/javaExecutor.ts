// import { TestCases } from "../types/testCases";
import CodeExecutorStrategy, { ExecutionResponse } from "../types/codeExecutorStrategy";
import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

class JavaExecutor implements CodeExecutorStrategy{
    async execute(code: string, inputTestCase: string): Promise<ExecutionResponse> {
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

        try {
            const codeResponse: string= await this.fetchDecodedStream(loggerStream, rawLogBuffer);
            return {output: codeResponse, status: "Completed"};
        } catch (error) {
            return {output: error as string, status: 'Error'};
        }
        finally{
            // removing the container when done with it
            await javaDockerContainer.remove();
        }
    }

    fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawLogBuffer: Buffer[]): Promise<string>{
        new Promise((res,rej)=>{
                loggerStream.on('end',()=>{
                console.log(rawLogBuffer);
                const completeBuffer=Buffer.concat(rawLogBuffer);
                const decodedStream=decodeDockerStream(completeBuffer);
                console.log(decodedStream);
                console.log(decodedStream.stdout);
                if(decodedStream.stderr){
                    rej(decodedStream.stderr);
                }
                else{
                    res(decodedStream.stdout);
                }
            });
        });
    }
    
}

export default JavaExecutor; 