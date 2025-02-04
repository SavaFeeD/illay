import type { Project } from "canvas-editor-engine/dist/types/project";
import type { IWorkplace } from "./workplace.types";

export interface IProjectIllay {
  id: number;
  title: string;
  preview: null | string; 
  workplaceProjects: IWorkplaceProject[];
};

export interface IWorkplaceProject {
  id: IWorkplace['id'];
  title: IWorkplace['title'];
  position: IWorkplace['position'];
  size: IWorkplace['size'];
  project: Project;
}

export type TSaveMethod = 'LocalStorage' | 'Server';

export enum E_STORAGE_KEYS {
  'projects' = 'PROJECTS_ILLAY',
};