import express from 'express';

import { addSubmission } from '../../controller/submissionController';
import { createSubmissionZodSchema } from '../../dtos/createSubmissionDto';
import { validate } from '../../validator/zodValidator';

const submissionRouter=express.Router();

submissionRouter.post('/',validate(createSubmissionZodSchema),addSubmission);

export default submissionRouter; 