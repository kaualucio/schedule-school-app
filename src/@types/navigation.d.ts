import { IHomework } from "../services/sqlite/HomeworkModel";

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      disciplinas: undefined;
      agenda: undefined;
      calendário: undefined;
      settings: undefined;
      newSubject: undefined;
      editSubject: any;
      newHomework: undefined;
      editHomework: any;
    }
  }
}