import type { IWorkplace } from "./workplace.types";

export type TToolName = 'cursor-worker' | 'grab' | 'create-workplace' | 'pipette' | 'excretion' | 'cursor-move' | 'crop' | 'change-quality';

export type TBarName = 'filter' | 'image' | 'history' | 'export' | 'settings' | 'layers';

export interface IChangeQuality {
  value: number;
  workplaceId: IWorkplace['id'] | null;
};