export type ModelName = 'model-02';

export interface WeddingModel {
  name: ModelName;
  displayName: string;
  /** Ruta relativa desde src/app/ para lazy import */
  pageModulePath: string;
  exportName: string;
  /** Si el modelo soporta temas */
  supportsThemes: boolean;
}
