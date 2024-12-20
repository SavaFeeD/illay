import type { IWorkplace } from "./workplace.types";

export type TToolName = 'grab' | 'create-workplace' | 'pipette' | 'excretion' | 'cursor-move' | 'crop' | 'change-quality';

export interface IChangeQuality {
  value: number;
  workplaceId: IWorkplace['id'] | null;
};