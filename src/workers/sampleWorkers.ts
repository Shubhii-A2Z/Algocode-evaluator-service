import { Job, Worker } from "bullmq";

import SampleJob from "../jobs/sampleJob";
import redisConnection from "../config/redis.config";

export default function sampleWorker(queueName: string){
    new Worker(queueName, async (job:Job)=>{
        if(job.name=='SampleJob'){
            const sampleJobInstance=new SampleJob(job.data);
            sampleJobInstance.handle();
            return true;
        }},
        {connection: redisConnection}
    );
}