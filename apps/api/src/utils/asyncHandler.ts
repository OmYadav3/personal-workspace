import type { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

const asyncHandler = (controller: AsyncController): RequestHandler => {
   return (req, res, next) => {
      Promise.resolve(controller(req, res, next)).catch(next);
   };
};

export { asyncHandler };
