import DockerStreamOutput from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";

export default function decodeDockerStream(buffer: Buffer): DockerStreamOutput{
    let offset=0; // this variable keeps track of current position in the buffer while parsing

    // the output that will store the accumulated stdout and stderr output as strings
    const output: DockerStreamOutput={stdout: '', stderr: ''};

    // loop until offset reaches end of buffer
    while(offset<buffer.length){

        // channel is read from buffer and has value of type stream
        const typeOfStream=buffer[offset]; 

        // this length variable holds the length of value
        const lengthOfValue=buffer.readUint32BE(offset+4);

        // as we've read the header, we can move forward to the next value of chunk
        offset+=DOCKER_STREAM_HEADER_SIZE; 

        if(typeOfStream==1){
            // stdout stream
            output.stdout+=buffer.toString("utf-8",offset,offset+lengthOfValue); // from [offset->offset+lengthOfValue] will be the value
        }
        else if(typeOfStream==2){
            // stderr stream
            output.stderr+=buffer.toString("utf-8",offset,offset+lengthOfValue);
        }

        // moving offset to the next chunk
        offset+=lengthOfValue;
    }

    return output;
}