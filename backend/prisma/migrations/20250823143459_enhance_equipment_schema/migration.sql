/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `Equipment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Equipment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."EquipmentStatus" AS ENUM ('OPERATIONAL', 'MAINTENANCE', 'OUT_OF_SERVICE', 'RETIRED');

-- CreateEnum
CREATE TYPE "public"."MaintenanceType" AS ENUM ('PREVENTIVE', 'CORRECTIVE', 'INSPECTION', 'REPAIR');

-- AlterTable
ALTER TABLE "public"."Equipment" ADD COLUMN     "available" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "cost" DOUBLE PRECISION,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "inUse" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastMaintenance" TIMESTAMP(3),
ADD COLUMN     "location" TEXT,
ADD COLUMN     "maintenance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "nextMaintenance" TIMESTAMP(3),
ADD COLUMN     "purchaseDate" TIMESTAMP(3),
ADD COLUMN     "serialNumber" TEXT,
ADD COLUMN     "status" "public"."EquipmentStatus" NOT NULL DEFAULT 'OPERATIONAL',
ADD COLUMN     "warrantyExpiry" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."MaintenanceLog" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "type" "public"."MaintenanceType" NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DOUBLE PRECISION,
    "performedBy" TEXT,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextDue" TIMESTAMP(3),

    CONSTRAINT "MaintenanceLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_serialNumber_key" ON "public"."Equipment"("serialNumber");

-- AddForeignKey
ALTER TABLE "public"."MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "public"."Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
