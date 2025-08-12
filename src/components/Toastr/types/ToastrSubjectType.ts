export type ToastrSubjectType = {
  success: StandarToastrObjProperties;
  error: StandarToastrObjProperties;
  warn: StandarToastrObjProperties;
  info: StandarToastrObjProperties;
  notify: StandarToastrObjProperties;
};

export type StandarToastrObjProperties = {
  show: boolean;
  textId: string;
  hrefTo?: string;
};
