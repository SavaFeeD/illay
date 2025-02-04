export interface IDocumentData {
  document: any;
  documentFsId: string;
}

export interface IOwnerDocumentData {
  name: string;
}

export interface IFsRules {
  delete: boolean;
  read: boolean;
};

export interface IOwner {
  id: string;
  fs_rules: IFsRules;
  document_data: IOwnerDocumentData;
}

export interface IDocumentInfo {
  ownerId: IOwner['id'];
  documentFsId: IDocumentData['documentFsId'];
  fsRules: IFsRules;
  countChunks: number;
  projectName: string;
}

export interface IChunk {
  chunkOrder: number;
  data: number[];
}

export interface ResponseBody {
  status: 200 | 404;
  status_message: "OK" | "ERROR";
  message?: string;
}

export interface ResponseData<T> extends ResponseBody{
  data: T;
}

export interface IChunkResponse extends ResponseBody {
  chunkOrder: number;
  data: number[];
}