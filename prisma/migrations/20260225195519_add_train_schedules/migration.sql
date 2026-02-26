-- CreateTable
CREATE TABLE "stations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_stops" (
    "id" TEXT NOT NULL,
    "route_id" TEXT NOT NULL,
    "station_id" TEXT NOT NULL,
    "sequence_order" INTEGER NOT NULL,
    "arrival_time" TEXT,
    "departure_time" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "route_stops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL,
    "route_id" TEXT NOT NULL,
    "train_number" TEXT NOT NULL,
    "train_type" TEXT,
    "departure_date" TIMESTAMP(3) NOT NULL,
    "departure_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stations_code_key" ON "stations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "route_stops_route_id_sequence_order_key" ON "route_stops"("route_id", "sequence_order");

-- AddForeignKey
ALTER TABLE "route_stops" ADD CONSTRAINT "route_stops_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_stops" ADD CONSTRAINT "route_stops_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "stations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
