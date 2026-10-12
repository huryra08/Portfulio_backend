import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { experienceService } from "./experience.service";

const createExperience = catchAsync(async (req, res) => {
    const result = await experienceService.createExperience(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Experience created successfully",
        data: result,
    });
});

const getAllExperience = catchAsync(async (req, res) => {
    const result = await experienceService.getAllExperience();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Experience retrieved successfully",
        data: result,
    });
});

const updateExperience = catchAsync(async (req, res) => {
    const result = await experienceService.updateExperience(req.params.id as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Experience updated successfully",
        data: result,
    });
});

const deleteExperience = catchAsync(async (req, res) => {
    const result = await experienceService.deleteExperience(req.params.id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Experience deleted successfully",
        data: result,
    });
});

export const experienceController = {
    createExperience,
    getAllExperience,
    updateExperience,
    deleteExperience,
};
