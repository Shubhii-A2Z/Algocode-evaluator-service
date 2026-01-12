import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes"

export const pingCheck=(_: Request,resp: Response)=>{
    return resp.status(StatusCodes.OK).json({
        mssg: `ping check ok`
    });
}