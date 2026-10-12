import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

type TMessagePayload = {
    name: string;
    email: string;
    subject?: string;
    body: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createMessage = async (payload: TMessagePayload) => {
    const { name, email, subject, body } = payload;

    if (!name || !email || !body) {
        throw new ApiError(httpStatus.BAD_REQUEST, "name, email and body are required");
    }

    if (!EMAIL_REGEX.test(email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Please provide a valid email address");
    }

    if (body.length < 10 || body.length > 2000) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Message must be between 10 and 2000 characters");
    }

    // only pick known fields so nothing else can be written
    return prisma.message.create({ data: { name, email, subject, body } });
};

const getAllMessages = async (isRead?: string) => {
    return prisma.message.findMany({
        where: isRead === undefined ? {} : { isRead: isRead === "true" },
        orderBy: { createdAt: "desc" },
    });
};

const markAsRead = async (id: string) => {
    return prisma.message.update({ where: { id }, data: { isRead: true } });
};

const deleteMessage = async (id: string) => {
    return prisma.message.delete({ where: { id } });
};

export const messageService = {
    createMessage,
    getAllMessages,
    markAsRead,
    deleteMessage,
};
