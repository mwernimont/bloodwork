-- AlterTable
ALTER TABLE "characters" ADD COLUMN     "faction" TEXT;

-- CreateTable
CREATE TABLE "character_relationships" (
    "id" SERIAL NOT NULL,
    "from_character_id" INTEGER NOT NULL,
    "to_character_id" INTEGER NOT NULL,
    "category" TEXT,
    "label" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "character_relationships_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "character_relationships" ADD CONSTRAINT "character_relationships_from_character_id_fkey" FOREIGN KEY ("from_character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_relationships" ADD CONSTRAINT "character_relationships_to_character_id_fkey" FOREIGN KEY ("to_character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
