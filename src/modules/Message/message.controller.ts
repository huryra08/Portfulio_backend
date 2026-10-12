import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { messageService } from "./message.service";

const createMessage = catchAsync(async (req, res) => {
    await messageService.createMessage(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Message sent successfully. Thank you for reaching out!",
        data: null,
    });
});

const getAllMessages = catchAsync(async (req, res) => {
    const isRead = typeof req.query.isRead === "string" ? req.query.isRead : undefined;
    const result = await messageService.getAllMessages(isRead);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Messages retrieved successfully",
        data: result,
    });
});

const markAsRead = catchAsync(async (req, res) => {
    const result = await messageService.markAsRead(req.params.id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Message marked as read",
        data: result,
    });
});

const deleteMessage = catchAsync(async (req, res) => {
    const result = await messageService.deleteMessage(req.params.id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Message deleted successfully",
        data: result,
    });
});

export const messageController = {
    createMessage,
    getAllMessages,
    markAsRead,
    deleteMessage,
};
