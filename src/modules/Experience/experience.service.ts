import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

type TExperiencePayload = {
    company: string;
    position: string;
    description?: string;
    location?: string;
    startDate: string;
    endDate?: string | null; // null / missing = current job
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

const createExperience = async (payload: TExperiencePayload) => {
    if (!payload.company || !payload.position || !payload.startDate) {
        throw new ApiError(httpStatus.BAD_REQUEST, "company, position and startDate are required");
    }

    const startDate = new Date(payload.startDate);
    const endDate = toDate(payload.endDate);
    assertDates(startDate, endDate);

    return prisma.experience.create({
        data: { ...payload, startDate, endDate },
    });
};

const getAllExperience = async () => {
    return prisma.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] });
};

const updateExperience = async (id: string, payload: Partial<TExperiencePayload>) => {
    const startDate = toDate(payload.startDate) ?? undefined;
    const endDate = toDate(payload.endDate);
    assertDates(startDate, endDate);

    return prisma.experience.update({
        where: { id },
        data: { ...payload, startDate, endDate },
    });
};

const deleteExperience = async (id: string) => {
    return prisma.experience.delete({ where: { id } });
};

export const experienceService = {
    createExperience,
    getAllExperience,
    updateExperience,
    deleteExperience,
};
