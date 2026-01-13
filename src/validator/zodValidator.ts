import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodSchema } from "zod/v3";

export const validate=(schema: ZodSchema<any>)=>(req:Request,resp: Response,next: NextFunction)=>{
    try {
        schema.parse({...req.body}); // checks if req body follows the schema
        next(); // calling the controller layer when schema is validated to be true
    } catch (error) {
        console.log(error);
        return resp.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            mssg: 'Invalid request params received',
            data: {},
            error: error
        });
    }
};