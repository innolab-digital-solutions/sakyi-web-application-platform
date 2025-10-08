export interface Permission {
  [module: string]: {
    [action: string]: string;
  };
}
