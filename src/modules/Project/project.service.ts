import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { Prisma } from "../../../generated/prisma/client";

type TProjectPayload = {
    title: string;
    slug: string;
    summary: string;
    description: string;
    thumbnail?: string;
    liveUrl?: string;
    repoUrl?: string;
    featured?: boolean;
    published?: boolean;
    order?: number;
    startedAt?: string;
    endedAt?: string;
    images?: { url: string; caption?: string; order?: number }[];
    skillIds?: string[];
    // "problem and how I fixed it" entries
    challenges?: { problem: string; solution: string; order?: number }[];
};

type TProjectFilters = { featured?: string; skill?: string };

// list view: light (no long problem/solution texts)
const listInclude = {
    images: { orderBy: { order: "asc" } },
    skills: { include: { skill: true } },
} satisfies Prisma.ProjectInclude;

// detail + admin: everything, including problems and fixes
const include = {
    ...listInclude,
    challenges: { orderBy: { order: "asc" } },
} satisfies Prisma.ProjectInclude;

const assertChallenges = (challenges?: TProjectPayload["challenges"]) => {
    if (challenges?.some((item) => !item.problem?.trim() || !item.solution?.trim())) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Every challenge needs both a problem and a solution");
    }
};

const orderBy: Prisma.ProjectOrderByWithRelationInput[] = [{ order: "asc" }, { createdAt: "desc" }];

const buildWhere = (filters: TProjectFilters, publishedOnly: boolean): Prisma.ProjectWhereInput => ({
    ...(publishedOnly && { published: true }),
    ...(filters.featured && { featured: filters.featured === "true" }),
    ...(filters.skill && {
        skills: { some: { skill: { name: { equals: filters.skill, mode: "insensitive" } } } },
    }),
});

const toDate = (value?: string) => (value ? new Date(value) : undefined);

const createProject = async (payload: TProjectPayload) => {
    const { images, skillIds, challenges, startedAt, endedAt, ...rest } = payload;

    if (!rest.title || !rest.slug || !rest.summary || !rest.description) {
        throw new ApiError(httpStatus.BAD_REQUEST, "title, slug, summary and description are required");
    }

    const existing = await prisma.project.findUnique({ where: { slug: rest.slug } });

    if (existing) {
        throw new ApiError(httpStatus.CONFLICT, "A project with this slug already exists");
    }

    assertChallenges(challenges);

    return prisma.project.create({
        data: {
            ...rest,
            startedAt: toDate(startedAt),
            endedAt: toDate(endedAt),
            images: images ? { create: images } : undefined,
            skills: skillIds ? { create: skillIds.map((skillId) => ({ skillId })) } : undefined,
            challenges: challenges
                ? { create: challenges.map((item, index) => ({ problem: item.problem.trim(), solution: item.solution.trim(), order: item.order ?? index })) }
                : undefined,
        },
        include,
    });
};

const getAllProjects = async (filters: TProjectFilters) => {
    return prisma.project.findMany({ where: buildWhere(filters, true), include: listInclude, orderBy });
};

// admin: includes unpublished drafts
const getAllProjectsAdmin = async (filters: TProjectFilters) => {
    return prisma.project.findMany({ where: buildWhere(filters, false), include, orderBy });
};

const getProjectBySlug = async (slug: string) => {
    const project = await prisma.project.findFirst({ where: { slug, published: true }, include });

    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
    }

    return project;
};

const updateProject = async (id: string, payload: Partial<TProjectPayload>) => {
    const { images, skillIds, challenges, startedAt, endedAt, ...rest } = payload;

    assertChallenges(challenges);

    return prisma.project.update({
        where: { id },
        data: {
            ...rest,
            startedAt: toDate(startedAt),
            endedAt: toDate(endedAt),
            // when images / skillIds / challenges are sent they REPLACE the existing ones
            ...(images && { images: { deleteMany: {}, create: images } }),
            ...(challenges && {
                challenges: {
                    deleteMany: {},
                    create: challenges.map((item, index) => ({ problem: item.problem.trim(), solution: item.solution.trim(), order: item.order ?? index })),
                },
            }),
            ...(skillIds && {
                skills: { deleteMany: {}, create: skillIds.map((skillId) => ({ skillId })) },
            }),
        },
        include,
    });
};

const deleteProject = async (id: string) => {
    return prisma.project.delete({ where: { id } });
};

export const projectService = {
    createProject,
    getAllProjects,
    getAllProjectsAdmin,
    getProjectBySlug,
    updateProject,
    deleteProject,
};
