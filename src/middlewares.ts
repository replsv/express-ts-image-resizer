import { Request, Response, NextFunction } from "express";
export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.info(`${req.method} - ${req.path} ${res.statusCode}`);
  next();
};
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization !== `Basic ${process.env.AUTH_KEY}`) {
    return res.status(401).send("Authentication required.");
  }
  next();
};
