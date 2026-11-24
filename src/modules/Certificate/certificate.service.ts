import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

type TCertificatePayload = {
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string | null; // null / missing = does not expire
    credentialId?: string;
    credentialUrl?: string;
    imageUrl?: string;
    description?: string;
    order?: number;
};

const toDate = (value?: string | null) => (value ? new Date(value) : value === null ? null : undefined);

const assertDates = (issue?: Date | null, expiry?: Date | null) => {
    if ((issue && isNaN(issue.getTime())) || (expiry && isNaN(expiry.getTime()))) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid date format, use YYYY-MM-DD");
    }
    if (issue && expiry && expiry < issue) {
        throw new ApiError(httpStatus.BAD_REQUEST, "expiryDate cannot be before issueDate");
    }
};

const createCertificate = async (payload: TCertificatePayload) => {
    if (!payload.title || !payload.issuer || !payload.issueDate) {
        throw new ApiError(httpStatus.BAD_REQUEST, "title, issuer and issueDate are required");
    }

    const issueDate = new Date(payload.issueDate);
    const expiryDate = toDate(payload.expiryDate);
    assertDates(issueDate, expiryDate);

    return prisma.certificate.create({ data: { ...payload, issueDate, expiryDate } });
};

const getAllCertificates = async () => {
    return prisma.certificate.findMany({ orderBy: [{ order: "asc" }, { issueDate: "desc" }] });
};

const updateCertificate = async (id: string, payload: Partial<TCertificatePayload>) => {
    const issueDate = toDate(payload.issueDate) ?? undefined;
    const expiryDate = toDate(payload.expiryDate);
    assertDates(issueDate, expiryDate);

    return prisma.certificate.update({ where: { id }, data: { ...payload, issueDate, expiryDate } });
};

const deleteCertificate = async (id: string) => {
    return prisma.certificate.delete({ where: { id } });
};

export const certificateService = {
    createCertificate,
    getAllCertificates,
    updateCertificate,
    deleteCertificate,
};
