import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { ApiError } from "./apiError";

// Maps the most common Prisma error codes to proper HTTP statuses
const getStatusCode = (error: unknown): number => {
    if (error instanceof ApiError) return error.statusCode;

    const code = (error as { code?: string })?.code;
    if (code === "P2025") return httpStatus.NOT_FOUND;
    if (code === "P2002") return httpStatus.CONFLICT;
    if (code === "P2003") return httpStatus.BAD_REQUEST;

    return httpStatus.INTERNAL_SERVER_ERROR;
};

export const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            console.log(error);

            const statusCode = getStatusCode(error);
            const message =
                statusCode === httpStatus.NOT_FOUND && !(error instanceof ApiError)
                    ? "Record not found"
                    : statusCode === httpStatus.CONFLICT && !(error instanceof ApiError)
                        ? "A record with this value already exists"
                        : (error as Error).message || "Something went wrong";

            res.status(statusCode).json({
                success: false,
                statusCode,
                message,
                error: message,
            });
        }
    };
};
