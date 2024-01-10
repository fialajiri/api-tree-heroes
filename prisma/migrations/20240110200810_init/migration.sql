-- CreateTable
CREATE TABLE "Hero" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Superpower" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "heroId" INTEGER NOT NULL,

    CONSTRAINT "Superpower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Villan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "heroId" INTEGER NOT NULL,

    CONSTRAINT "Villan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Superpower_heroId_key" ON "Superpower"("heroId");

-- CreateIndex
CREATE UNIQUE INDEX "Villan_heroId_key" ON "Villan"("heroId");

-- AddForeignKey
ALTER TABLE "Superpower" ADD CONSTRAINT "Superpower_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "Hero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Villan" ADD CONSTRAINT "Villan_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "Hero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
