
export type TStorageItemBase = {
  // UUID?
  id: string,
  name: string,
  isPath: boolean,
};

export type TStorageItemFile = TStorageItemBase & {
  isPath: false,
  md5: string,
};

export type TStorageItemPath = TStorageItemBase & {
  isPath: true,
  files: TStorageItem[],
};

export type TStorageItem = TStorageItemFile | TStorageItemPath;

export type TStorageStructure = Record<string, TStorageItem>;

export type TStorage = {
  id: string,
  structure: TStorageStructure,
};

export type TStorageFile = {
  id: string,
  md5: string,
  blob: Blob,
};
