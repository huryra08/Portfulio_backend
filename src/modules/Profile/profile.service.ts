import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

type TProfilePayload = {
    fullName: string;
    headline: string;
    bio: string;
    avatarUrl?: string;
    resumeUrl?: string;
    location?: string;
    contactEmail?: string;
    phone?: string;
    socialLinks?: { platform: string; url: string; order?: number }[];
};

const include = { socialLinks: { orderBy: { order: "asc" } } } as const;

const getProfile = async () => {
    const profile = await prisma.profile.findFirst({ include });

    if (!profile) {
        throw new ApiError(httpStatus.NOT_FOUND, "Profile has not been set up yet");
    }

    return profile;
};

// Creates the profile on the first call, updates it afterwards
const updateProfile = async (userId: string, payload: Partial<TProfilePayload>) => {
    const { socialLinks, ...data } = payload;
    const existing = await prisma.profile.findUnique({ where: { userId } });

    if (!existing) {
        if (!data.fullName || !data.headline || !data.bio) {
            throw new ApiError(httpStatus.BAD_REQUEST, "fullName, headline and bio are required to create your profile");
        }

        return prisma.profile.create({
            data: {
                fullName: data.fullName,
                headline: data.headline,
                bio: data.bio,
                avatarUrl: data.avatarUrl,
                resumeUrl: data.resumeUrl,
                location: data.location,
                contactEmail: data.contactEmail,
                phone: data.phone,
                userId,
                socialLinks: socialLinks ? { create: socialLinks } : undefined,
            },
            include,
        });
    }

    return prisma.profile.update({
        where: { userId },
        data: {
            ...data,
            // when socialLinks is sent it REPLACES the existing list
            ...(socialLinks && { socialLinks: { deleteMany: {}, create: socialLinks } }),
        },
        include,
    });
};

export const profileService = {
    getProfile,
    updateProfile,
};
