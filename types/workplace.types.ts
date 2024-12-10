import type { ITool } from "canvas-editor-engine/dist/types/general";

export interface IEntityWorkplace {
  name: string;
}

export interface IWorkplace extends IEntityWorkplace{
  id: number;
};

export interface ICreateWorkplace extends IEntityWorkplace{
  id?: number;
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

// export interface ILoadedImage {
//   workplaceId: IWorkplace['id'];
//   src: string;
// }