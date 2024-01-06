/*
  Warnings:

  - Added the required column `itemName` to the `ProductPurchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ProductPurchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `ProductPurchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductPurchase" ADD COLUMN     "itemName" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;
