import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

type TEducationPayload = {
    institution: string;
    degree: string;
    field?: string;
    grade?: string;
    location?: string;
    description?: string;
    startDate: string;
    endDate?: string | null; // null / missing = still studying
    order?: number;
};

const toDate = (value?: string | null) => (value ? new Date(value) : value === null ? null : undefined);

const assertDates = (start?: Date | null, end?: Date | null) => {
    if ((start && isNaN(start.getTime())) || (end && isNaN(end.getTime()))) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid date format, use YYYY-MM-DD");
    }
    if (start && end && end < start) {
        throw new ApiError(httpStatus.BAD_REQUEST, "endDate cannot be before startDate");
    }
};

const createEducation = async (payload: TEducationPayload) => {
    if (!payload.institution || !payload.degree || !payload.startDate) {
        throw new ApiError(httpStatus.BAD_REQUEST, "institution, degree and startDate are required");
    }

    const startDate = new Date(payload.startDate);
    const endDate = toDate(payload.endDate);
    assertDates(startDate, endDate);

    return prisma.education.create({ data: { ...payload, startDate, endDate } });
};

const getAllEducation = async () => {
    return prisma.education.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] });
};

const updateEducation = async (id: string, payload: Partial<TEducationPayload>) => {
    const startDate = toDate(payload.startDate) ?? undefined;
    const endDate = toDate(payload.endDate);
    assertDates(startDate, endDate);

    return prisma.education.update({ where: { id }, data: { ...payload, startDate, endDate } });
};

const deleteEducation = async (id: string) => {
    return prisma.education.delete({ where: { id } });
};

export const educationService = {
    createEducation,
    getAllEducation,
    updateEducation,
    deleteEducation,
};
