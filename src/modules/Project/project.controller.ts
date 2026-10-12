import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { projectService } from "./project.service";

const getFilters = (query: Record<string, unknown>) => ({
    featured: typeof query.featured === "string" ? query.featured : undefined,
    skill: typeof query.skill === "string" ? query.skill : undefined,
});

const createProject = catchAsync(async (req, res) => {
    const result = await projectService.createProject(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Project created successfully",
        data: result,
    });
});

const getAllProjects = catchAsync(async (req, res) => {
    const result = await projectService.getAllProjects(getFilters(req.query));

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Projects retrieved successfully",
        data: result,
    });
});

const getAllProjectsAdmin = catchAsync(async (req, res) => {
    const result = await projectService.getAllProjectsAdmin(getFilters(req.query));

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All projects retrieved successfully",
        data: result,
    });
});

const getProjectBySlug = catchAsync(async (req, res) => {
    const result = await projectService.getProjectBySlug(req.params.slug as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Project retrieved successfully",
        data: result,
    });
});

const updateProject = catchAsync(async (req, res) => {
    const result = await projectService.updateProject(req.params.id as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Project updated successfully",
        data: result,
    });
});

const deleteProject = catchAsync(async (req, res) => {
    const result = await projectService.deleteProject(req.params.id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Project deleted successfully",
        data: result,
    });
});

export const projectController = {
    createProject,
    getAllProjects,
    getAllProjectsAdmin,
    getProjectBySlug,
    updateProject,
    deleteProject,
};
