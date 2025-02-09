import type { Project } from 'canvas-editor-engine/dist/types/project';
import type WebComponent from 'canvas-editor-engine/dist/web-component';
import { defineStore } from 'pinia'
import { E_STORAGE_KEYS, type IProjectIllay, type IWorkplaceProject, type TSaveMethod } from '~/types/project-illay.types';
import type { IWorkplace, ICreateWorkplace, IToolRegistryItem, ISelectedWorkplace, IPutWorkplaceSettings, ISelectedPainter } from '~/types/workplace.types';

import * as CryptoJS from 'crypto-js';
// @ts-ignore
import lzwCompress from 'lzwcompress';
import { http } from '~/composables/HTTP';
import type { IChunk, IChunkResponse, IDocumentInfo, ResponseBody, ResponseData } from '~/types/document.types';
import type Painter from 'canvas-editor-engine/dist/utils/painter';

export const useWorkplaceStore = defineStore('workplace', {
  state: () => ({
    workplaceList: [] as IWorkplace[],
    toolRegistry: [] as IToolRegistryItem[],
    selectedWorkplace: null as ISelectedWorkplace | null,
    selectedPainter: null as ISelectedPainter | null,
    tempIds: [] as { workplaceId: string, editorId: string }[],
    pulledProjects: [] as Project[],
    projectIllay: null as IProjectIllay | null,
    projectSaved: false as boolean,
    progressBarChunks: {
      countChunks: 0,
      readyCount: 0,
    },
    projectsInfo: [] as IDocumentInfo[],
    projectIllayForRestore: null as IProjectIllay | null,
    restoreProgressBar: {
      chunks: {
        countChunks: 0,
        readyCount: 0,
      },
      decompressed: false,
      workplacesRestore: false,
      editorsRestore: false,
    },
    finalyRestoreStatus: false,
  }),

  getters: {
    getWorkplaceList: state => state.workplaceList,
    getSelectedWorkplace: state => state.selectedWorkplace,
    getSelectedPainter: state => state.selectedPainter,
    getToolRegistry: state => state.toolRegistry,
    isProjectSaved: state => state.projectSaved,
    getProgressBarChunksProgress: state => state.progressBarChunks,
    getProjectsInfo: state => state.projectsInfo,
    getProjectIllayForRestore: state => state.projectIllayForRestore,
    getRestoreProgressBar: state => state.restoreProgressBar,
    isFinishRestore: state => {
      return (
        state.restoreProgressBar.chunks.readyCount === state.restoreProgressBar.chunks.countChunks &&
        state.restoreProgressBar.decompressed &&
        state.restoreProgressBar.workplacesRestore &&
        state.restoreProgressBar.editorsRestore
      );
    },
    isFinalyRestoreStatus: state => state.finalyRestoreStatus,
  },

  actions: {
    restoreWorkplace(workplace: IWorkplace) {
      this.workplaceList.push(workplace);
    },

    workplacesRestored() {
      this.restoreProgressBar.workplacesRestore = true;
    },

    editorsRestored() {
      this.restoreProgressBar.editorsRestore = true;
    },

    setFinalyRestoreStatus(value: boolean) {
      this.finalyRestoreStatus = value;
    },

    createWorkplace(workplace: ICreateWorkplace) {
      const id = Date.now();
      const workplaceData: IWorkplace = {
        id,
        title: `Workplace #${id}`,
        editor: null,
        activeLayerId: null,
        ...workplace,
      };
      this.workplaceList.push(workplaceData);
    },

    setEditorForWorkplace(workplaceId: IWorkplace['id'], editor: WebComponent) {
      const workplace = this.workplaceList.find((workplace) => workplace.id === workplaceId);
      if (!!workplace) {
        workplace.editor = editor;
      }
    },

    setActiveLayerForWorkplace(workplaceId: IWorkplace['id'], activeLayerId: IWorkplace['activeLayerId']) {
      const workplace = this.workplaceList.find((workplace) => workplace.id === workplaceId);
      if (!!workplace) {
        workplace.activeLayerId = activeLayerId;
      }
      if (workplace?.id === this.selectedWorkplace?.id) {
        if (!this.selectedWorkplace?.activeLayerId) return;
        this.selectedWorkplace.activeLayerId = activeLayerId;
      }
    },

    setPositionForWorkplace(workplaceId: IWorkplace['id'], position: IWorkplace['position']) {
      const workplace = this.workplaceList.find((workplace) => workplace.id === workplaceId);
      if (!!workplace) {
        workplace.position = position;
      }
    },

    addToolRegistryItem(workplaceId: IWorkplace['id'], registry: IToolRegistryItem['registry']) {
      const item: IToolRegistryItem = {
        workplaceId: workplaceId,
        registry,
      };
      this.toolRegistry.push(item);
    },

    selectWorkplace(workplaceId: IWorkplace['id'] | null, ctx: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement | null, editor: WebComponent | null) {
      const workplace = this.workplaceList.find((workplace) => workplace.id === workplaceId);
      if (!!workplace && !!ctx && !!canvas && !!editor) {
        const selectedWorkplace: ISelectedWorkplace = {
          ...workplace,
          ctx,
          canvas,
          editor,
        };
        this.selectedWorkplace = selectedWorkplace;
      } else {
        this.selectedWorkplace = null;
      }
    },

    selectPainter(painter: Painter | null) {
      const workplaceId = this.selectedWorkplace?.id;
      if (this.selectedPainter) {
        this.selectedPainter.painter.unselectPainter();
      }
      if (painter && workplaceId) {  
        painter.selectPainter();
        this.selectedPainter = {
          workplaceId,
          painter,
        };
      } else {
        this.selectedPainter = null;
      }
    },

    unset() {
      this.selectedWorkplace = null;
    },

    resetIsSavedProjectState() {
      this.projectSaved = false;
    },

    putWorkplaceSettings(workplaceId: IWorkplace['id'], settings: IPutWorkplaceSettings) {
      const listing = this.workplaceList.map((workplace) => {
        if (workplace.id === workplaceId) {
          if (settings.position) {
            workplace.position = settings.position;
          }
          if (settings.size) {
            workplace.size = settings.size;
          }
        }
        return workplace;
      });
      if (listing) {
        this.workplaceList = listing;
      }
    },

    pullProjects() {
      this.tempIds = [];
      const projects: Project[] = [];
      this.workplaceList.forEach(({ id, title, editor }) => {
        if (!editor) return;

        editor.pullProjectService.pull(title, `${title} (#${id})`);
        const project: Project = editor.pullProjectService.project;
        this.tempIds.push({
          workplaceId: `${id}`,
          editorId: project.id,
        });

        projects.push(project);
      });
      this.pulledProjects = projects;
    },

    packageWorkplaceProject(title: IProjectIllay['title']) {
      if (!this.pulledProjects.length) return console.warn(`Perhaps the projects weren't pulled!`);

      const workplaceProjects: IWorkplaceProject[] = [];
      this.pulledProjects.forEach((project) => {
        const tempIds = this.tempIds.find((ids) => ids.editorId === project.id);
        const workplace = this.workplaceList.find((workplace) => `${workplace.id}` === tempIds?.workplaceId);
        if (!workplace) return;

        const workplaceProject: IWorkplaceProject = {
          id: workplace.id,
          title: workplace.title,
          position: workplace.position,
          size: workplace.size,
          project: project,
        };

        workplaceProjects.push(workplaceProject);
      });

      const projectIllay: IProjectIllay = {
        id: Date.now(),
        title: title,
        preview: null,
        workplaceProjects: workplaceProjects,
      };

      this.projectIllay = projectIllay;
    },

    saveProjectIllay(to: TSaveMethod) {
      if (!this.projectIllay) return console.warn(`The projects may not have been packaged!`);
      
      switch(to) {
        case 'LocalStorage':
          this.saveToLocalStorage(this.projectIllay);
          break;
        case 'Server':
          this.saveToServerStorage(this.projectIllay);
          break;
        default:
          console.warn('A non-existent method was selected!');
          break;
      };
    },

    async saveToLocalStorage(project: IProjectIllay) {
      const projectPackage = JSON.stringify(project);
      const compressed: number[] = lzwCompress.pack(projectPackage);
      const chunks = this.getChunks(compressed);
    },

    saveToServerStorage(project: IProjectIllay) {
      setTimeout(async () => {
        const projectPackage = JSON.stringify(project);
        const ownerId = 'adac59eb-58fb-485f-8da9-7ed9cc023dbb';

        new Promise((resolve) => {
          const compressed: number[] = lzwCompress.pack(projectPackage);
          resolve(compressed);
        }).then(async (compressed) => {
          const { chunks, countChunks } = this.getChunks(compressed as number[]);
          this.progressBarChunks.countChunks = countChunks;
          this.progressBarChunks.readyCount = 0;
          let documentFsId: string | null = null;
          try {
            const res = await http().post('/document', {
              ownerId: ownerId,
              countChunks: countChunks,
              projectName: project.title,
              data: JSON.stringify({
                countChunks: countChunks,
              }),
            });
            documentFsId = res.data.data.documentFsId;
          } catch(e) {
            console.error(e);
          }
          const chunksRequests = [];
          for (let i = 0; i < countChunks; i++) {
            chunksRequests.push(
              http().post(`/chunk/${ownerId}?documentFsId=${documentFsId}`, {
                chunkOrder: i,
                data: JSON.stringify(chunks[i]),
              }).then(() => {
                this.progressBarChunks.readyCount++;
              })
            );
          }
          Promise.all(chunksRequests).then(() => {
            this.projectSaved = true;
          });
        });
      }, 10);
    },

    getChunks(compressed: number[]) {
      const chunkSize = 10000;
      const countChunks = Math.ceil(compressed.length / chunkSize);
      const chunks: number[][] = [];

      for (let i = 0; i < compressed.length; i += chunkSize) {
        const chunk = compressed.slice(i, i + chunkSize);
        chunks.push(chunk);
      }
      
      return { chunks, countChunks };
    },

    async getProjectInfoIds() {
      const ownerId = 'adac59eb-58fb-485f-8da9-7ed9cc023dbb';
      const projectInfoReq = await http().get(`/documents-info/${ownerId}`);
      const fsids: string[] = projectInfoReq.data.data;
      return fsids;
    },

    async getProjectInfo(documentFsId: string) {
      try {
        const ownerId = 'adac59eb-58fb-485f-8da9-7ed9cc023dbb';

        const projectInfoReq = await http().get(`/documents/${ownerId}?documentFsId=${documentFsId}`);
        const projectInfoData: ResponseData<IDocumentInfo[]> = projectInfoReq.data;

        if (projectInfoData.status_message === 'ERROR') throw new Error(projectInfoData?.message);

        const projectInfo: IDocumentInfo = projectInfoData.data[0];

        const findIndex = this.projectsInfo.findIndex((info) => info.documentFsId === documentFsId);

        if (findIndex !== -1) {
          this.projectsInfo[findIndex] = projectInfo;
        } else {
          this.projectsInfo.push(projectInfo);
        }
      } catch(e) {
        console.error(e);
      }
    },

    clearProjectsInfo() {
      this.projectsInfo = [];
    },

    async getChunkFromServerStrorage(chunkOrder: number, documentFsId: string) {
      const ownerId = 'adac59eb-58fb-485f-8da9-7ed9cc023dbb';
      return await http().get(`/chunk/${ownerId}?documentFsId=${documentFsId}&chunkOrder=${chunkOrder}`) as IChunkResponse;
    },

    uncompressProject(compressed: number[]) {
      const projectPackage = lzwCompress.unpack(compressed);
      const project = JSON.parse(projectPackage);
      return project as IProjectIllay;
    },

    getProjectById(documentInfo: IDocumentInfo) {
      const countChunks = documentInfo.countChunks;
      const chunksPromises: Promise<IChunkResponse>[] = [];
      
      this.restoreProgressBar.chunks.countChunks = countChunks;
      this.restoreProgressBar.chunks.readyCount = 0;
      
      for (let i = 0; i < countChunks; i++) {
        chunksPromises.push(
          this.getChunkFromServerStrorage(i, documentInfo.documentFsId).then((result) => {
            this.restoreProgressBar.chunks.readyCount++;
            return result.data as unknown as IChunkResponse;
          })
        );
      }

      Promise.all(chunksPromises).then((chunks) => {
        const chunksData = chunks.sort((a, b) => a.chunkOrder - b.chunkOrder).map((chunk) => chunk.data);
        const compressed: number[] = chunksData.flat();
        const project = this.uncompressProject(compressed);
        this.restoreProgressBar.decompressed = true;
        this.projectIllayForRestore = project;
      });
    },

  },
  
});