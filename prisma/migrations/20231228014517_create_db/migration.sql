-- CreateTable
CREATE TABLE "marketPrice" (
    "id" SERIAL NOT NULL,
    "pair" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketPrice_pkey" PRIMARY KEY ("id")
);
