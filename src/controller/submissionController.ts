import { Request, Response } from "express";

import { createSubmissionDto } from "../dtos/createSubmissionDto";
import { StatusCodes } from "http-status-codes";

export function addSubmission(req: Request,resp: Response){
    const submissionDto=req.body as createSubmissionDto;
    // ToDo: adding validation using zod 
    return resp.status(StatusCodes.ACCEPTED).json({
        success: true,
        error: {},
        message: 'Successfully collected the submission',
        data: submissionDto
    });
}