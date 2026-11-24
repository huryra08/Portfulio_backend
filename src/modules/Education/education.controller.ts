import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { educationService } from "./education.service";

const createEducation = catchAsync(async (req, res) => {
    const result = await educationService.createEducation(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Education created successfully",
        data: result,
    });
});

const getAllEducation = catchAsync(async (req, res) => {
    const result = await educationService.getAllEducation();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Education retrieved successfully",
        data: result,
    });
});

const updateEducation = catchAsync(async (req, res) => {
    const result = await educationService.updateEducation(req.params.id as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Education updated successfully",
        data: result,
    });
});

const deleteEducation = catchAsync(async (req, res) => {
    const result = await educationService.deleteEducation(req.params.id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Education deleted successfully",
        data: result,
    });
});

export const educationController = {
    createEducation,
    getAllEducation,
    updateEducation,
    deleteEducation,
};
