import { Job } from "bullmq";

import { IJob } from "../types/bullMqJobDefinition";
import createExecutor from "../utils/executorFactory";
import { ExecutionResponse } from "../types/codeExecutorStrategy";
import { SubmissionPayload } from "../types/submissionPayload";

export default class SubmissionJob implements IJob{
    name: string;
    payload: Record<string, SubmissionPayload>;

    constructor(payload: Record<string,SubmissionPayload>){
        this.name=this.constructor.name;
        this.payload=payload;
    }

    handle=async (job?: Job)=>{
        if(job){
            const key=Object.keys(this.payload)[0];
            const codeLanguage=this.payload[key].language;
            const code=this.payload[key].code;
            const inputTestCase=this.payload[key].inputTestCase;
            const strategy=createExecutor(codeLanguage);
            if(strategy!=null){
                const response: ExecutionResponse=await strategy.execute(code,inputTestCase);
                if(response.status==='COMPLETED'){
                    console.log('Code Executed');
                }
                else{
                    console.log('Something went wrong');
                }
                console.log(response);
            }
        }
    };

    failed=(job?: Job): void=>{
        console.log('Job failed ');
        if(job) console.log(job.id);
    };
}