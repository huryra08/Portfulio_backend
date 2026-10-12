import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";

const registerUser = async (payload: {
    name: string;
    email: string;
    password: string;
    role?: string;
}) => {
    if (!payload.name || !payload.email || !payload.password) {
        throw new ApiError(httpStatus.BAD_REQUEST, "name, email and password are required");
    }

    if (payload.password.length < 6) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Password must be at least 6 characters");
    }

    if (payload.role && payload.role === "ADMIN") {
        throw new ApiError(httpStatus.FORBIDDEN, "You cannot register as an admin");
    }

    const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });

    if (existingUser) {
        throw new ApiError(httpStatus.CONFLICT, "A user with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(
        payload.password,
        Number(config.bcrypt_salt_rounds) || 10
    );

    const user = await prisma.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            role: "VISITOR",
        },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const loginUser = async (payload: { email: string; password: string }) => {
    if (!payload.email || !payload.password) {
        throw new ApiError(httpStatus.BAD_REQUEST, "email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email: payload.email } });

    // same message for "no account" and "wrong password" so emails cannot be enumerated
    const isPasswordValid = user ? await bcrypt.compare(payload.password, user.password) : false;

    if (!user || !isPasswordValid) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    if (user.activeStatus === "BLOCKED") {
        throw new ApiError(httpStatus.FORBIDDEN, "Your account is blocked, please contact support");
    }

    const jwtPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires_in);
    const refreshToken = jwtUtils.createToken(jwtPayload, config.jwt_refresh_secret, config.jwt_refresh_expires_in);

    const { password, ...userWithoutPassword } = user;

    return { accessToken, refreshToken, user: userWithoutPassword };
};

const getMe = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        include: { profile: 
            { include: 
                { socialLinks: true 

                } 
            } 
        },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const authService = {
    registerUser,
    loginUser,
    getMe,
};
