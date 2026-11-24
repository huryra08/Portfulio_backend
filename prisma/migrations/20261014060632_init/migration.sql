-- CreateTable
CREATE TABLE "project_challenges" (
    "id" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "project_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_challenges_projectId_idx" ON "project_challenges"("projectId");

-- AddForeignKey
ALTER TABLE "project_challenges" ADD CONSTRAINT "project_challenges_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
