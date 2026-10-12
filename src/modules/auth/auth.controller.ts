import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // a frontend on another domain (e.g. Vercel) needs SameSite=None over HTTPS
    sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
};

const register = catchAsync(async (req, res) => {
    const result = await authService.registerUser(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: result,
    });
});

const login = catchAsync(async (req, res) => {
    const result = await authService.loginUser(req.body);

    res.cookie("accessToken", result.accessToken, cookieOptions);
    res.cookie("refreshToken", result.refreshToken, cookieOptions);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Logged in successfully",
        data: result,
    });
});

const logout = catchAsync(async (req, res) => {
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Logged out successfully",
        data: null,
    });
});

const getMe = catchAsync(async (req, res) => {
    const result = await authService.getMe(req.user!.id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Current user retrieved successfully",
        data: result,
    });
});

export const authController = {
    register,
    login,
    logout,
    getMe,
};
