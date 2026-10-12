import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

type TSkillPayload = {
    name: string;
    category: string;
    level?: number;
    iconUrl?: string;
    order?: number;
};

const createSkill = async (payload: TSkillPayload) => {
    if (!payload.name || !payload.category) {
        throw new ApiError(httpStatus.BAD_REQUEST, "name and category are required");
    }

    if (payload.level !== undefined && (payload.level < 1 || payload.level > 5)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "level must be between 1 and 5");
    }

    const existing = await prisma.skill.findUnique({ where: { name: payload.name } });

    if (existing) {
        throw new ApiError(httpStatus.CONFLICT, "A skill with this name already exists");
    }

    return prisma.skill.create({ data: payload });
};

const getAllSkills = async () => {
    return prisma.skill.findMany({
        orderBy: [{ category: "asc" }, { order: "asc" }],
        include: { _count: { select: { projects: true } } },
    });
};

const updateSkill = async (id: string, payload: Partial<TSkillPayload>) => {
    if (payload.level !== undefined && (payload.level < 1 || payload.level > 5)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "level must be between 1 and 5");
    }

    return prisma.skill.update({ where: { id }, data: payload });
};

const deleteSkill = async (id: string) => {
    return prisma.skill.delete({ where: { id } });
};

export const skillService = {
    createSkill,
    getAllSkills,
    updateSkill,
    deleteSkill,
};
