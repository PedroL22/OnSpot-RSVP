/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('CONFIRMED', 'WAITLISTED');

-- CreateEnum
CREATE TYPE "EventActivityType" AS ENUM ('RSVP_CREATED', 'RSVP_WAITLISTED', 'RSVP_PROMOTED', 'RSVP_CHECKED_IN');

-- CreateEnum
CREATE TYPE "EventActivityActorType" AS ENUM ('ORGANIZER', 'GUEST', 'SYSTEM');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdById_fkey";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "organizer_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "capacity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rsvps" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "RsvpStatus" NOT NULL DEFAULT 'CONFIRMED',
    "checked_in_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rsvps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_activities" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "rsvp_id" TEXT,
    "type" "EventActivityType" NOT NULL,
    "actor_type" "EventActivityActorType" NOT NULL,
    "actor_user_id" TEXT,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_public_id_key" ON "events"("public_id");

-- CreateIndex
CREATE INDEX "events_organizer_id_starts_at_idx" ON "events"("organizer_id", "starts_at");

-- CreateIndex
CREATE INDEX "rsvps_event_id_status_idx" ON "rsvps"("event_id", "status");

-- CreateIndex
CREATE INDEX "rsvps_event_id_checked_in_at_idx" ON "rsvps"("event_id", "checked_in_at");

-- CreateIndex
CREATE UNIQUE INDEX "rsvps_event_id_email_key" ON "rsvps"("event_id", "email");

-- CreateIndex
CREATE INDEX "event_activities_event_id_created_at_idx" ON "event_activities"("event_id", "created_at");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_activities" ADD CONSTRAINT "event_activities_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_activities" ADD CONSTRAINT "event_activities_rsvp_id_fkey" FOREIGN KEY ("rsvp_id") REFERENCES "rsvps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_activities" ADD CONSTRAINT "event_activities_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
