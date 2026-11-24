import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { certificateService } from "./certificate.service";

const createCertificate = catchAsync(async (req, res) => {
    const result = await certificateService.createCertificate(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Certificate created successfully",
        data: result,
    });
});

const getAllCertificates = catchAsync(async (req, res) => {
    const result = await certificateService.getAllCertificates();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Certificates retrieved successfully",
        data: result,
    });
});

const updateCertificate = catchAsync(async (req, res) => {
    const result = await certificateService.updateCertificate(req.params.id as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Certificate updated successfully",
        data: result,
    });
});

const deleteCertificate = catchAsync(async (req, res) => {
    const result = await certificateService.deleteCertificate(req.params.id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Certificate deleted successfully",
        data: result,
    });
});

export const certificateController = {
    createCertificate,
    getAllCertificates,
    updateCertificate,
    deleteCertificate,
};
