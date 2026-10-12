import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

type JwtCreateTokenOptions = string | SignOptions;

const createToken = (payload: JwtPayload, secret: string, expiresIn: JwtCreateTokenOptions) => {
    const signOptions: SignOptions =
        typeof expiresIn === "string"
            ? ({ expiresIn: expiresIn.trim() } as SignOptions)
            : expiresIn;

    const token = jwt.sign(payload, secret, signOptions);
    return token;
};

const verifyToken = (token: string, secret: string) => {
    try {
        const decoded = jwt.verify(token, secret);
        return {
            success: true,
            data: decoded,
        };
    } catch (error) {
        console.log("Token verification fail:", error);
        return {
            success: false,
            error: (error as Error).message,
        };
    }
};

export const jwtUtils = {
    createToken,
    verifyToken,
};
