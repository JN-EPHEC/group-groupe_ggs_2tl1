import type { Request, Response, NextFunction } from "express";

const basicAuth = (req: Request,res: Response,next: NextFunction) => {
    const headers = req.headers.authorization;

    if (!headers || !headers.startsWith("Basic ")) {
        return res.status(401).send("Unauthorized");
    }

    const base64String = headers.split(" ")[1];

    if (!base64String) {
        return res.status(401).send("Unauthorized");
    }

    const credentials = Buffer.from(base64String, 'base64').toString('utf-8');

    const user = credentials.split(":")[0];
    const password = credentials.split(":")[1];

    if (user === "admin" && password === "supersecret") {
        return next();
    }
    else return res.status(401).send("Unauthorized");
}

export default basicAuth;