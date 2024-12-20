import type { IPosition, ISize, ITool } from "canvas-editor-engine/dist/types/general";

export interface IEntityWorkplace {
  position: IPosition;
  size: ISize;
}

export interface IWorkplace extends IEntityWorkplace{
  id: number;
  title: string;
};

export interface ICreateWorkplace extends IEntityWorkplace{
  id?: number;
  title?: string;
};

export interface IPutWorkplaceSettings {
  position?: IPosition;
  size?: ISize;
}

export interface ISelectedWorkplace extends IWorkplace{
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  editor: HTMLDivElement;
};

export interface IToolRegistryItem {
  workplaceId: IWorkplace['id'];
  registry: ITool[];
}