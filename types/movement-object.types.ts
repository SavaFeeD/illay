export interface IMovementData {
  left: number;
  top: number;
};

export interface IMovementActions {
  start: boolean;
  end: boolean;
  move: boolean;
};

export type TZoomValue = number;

export enum E_GLOBAL_MOVEMENT_OBJECT_INDEX {
  SPACE_CONTAINER = 0,
};