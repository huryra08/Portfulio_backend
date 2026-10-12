import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { profileService } from "./profile.service";

const getProfile = catchAsync(async (req, res) => {
    const result = await profileService.getProfile();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile retrieved successfully",
        data: result,
    });
});

const updateProfile = catchAsync(async (req, res) => {
    const result = await profileService.updateProfile(req.user!.id, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile saved successfully",
        data: result,
    });
});

export const profileController = {
    getProfile,
    updateProfile,
};
