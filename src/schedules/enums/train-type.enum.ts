/**
 * Predefined train types. Keep in sync with train_types table (see prisma/seed.ts).
 */
export enum TrainType {
  Express = 'express',
  Regional = 'regional',
  Intercity = 'intercity',
  HighSpeed = 'high_speed',
  Commuter = 'commuter',
}
