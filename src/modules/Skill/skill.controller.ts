import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { skillService } from "./skill.service";

const createSkill = catchAsync(async (req, res) => {
    const result = await skillService.createSkill(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Skill created successfully",
        data: result,
    });
});

const getAllSkills = catchAsync(async (req, res) => {
    const result = await skillService.getAllSkills();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Skills retrieved successfully",
        data: result,
    });
});

const updateSkill = catchAsync(async (req, res) => {
    const result = await skillService.updateSkill(req.params.id as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Skill updated successfully",
        data: result,
    });
});

const deleteSkill = catchAsync(async (req, res) => {
    const result = await skillService.deleteSkill(req.params.id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Skill deleted successfully",
        data: result,
    });
});

export const skillController = {
    createSkill,
    getAllSkills,
    updateSkill,
    deleteSkill,
};
