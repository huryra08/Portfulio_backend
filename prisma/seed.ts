import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";

async function main() {
    const name = process.env.ADMIN_NAME || "Admin";
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first");
    }

    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword, role: "ADMIN", name },
        create: { name, email, password: hashedPassword, role: "ADMIN" },
    });

    console.log(`Admin ready: ${admin.email}`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
