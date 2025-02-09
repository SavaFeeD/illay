import type { ILayer } from "canvas-editor-engine/dist/types/draw-layers";
import type { IPosition, ISize, ITool } from "canvas-editor-engine/dist/types/general";
import type Painter from "canvas-editor-engine/dist/utils/painter";
import type WebComponent from "canvas-editor-engine/dist/web-component";

export interface IEntityWorkplace {
  position: IPosition;
  size: ISize;
}

export interface IWorkplace extends IEntityWorkplace{
  id: number;
  title: string;
  editor: null | WebComponent;
  activeLayerId: null | ILayer['id'];
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
  editor: WebComponent;
};

export interface IToolRegistryItem {
  workplaceId: IWorkplace['id'];
  registry: ITool[];
}

export interface ISelectedPainter {
  workplaceId: IWorkplace['id'];
  painter: Painter;
}