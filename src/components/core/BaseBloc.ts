import { toastrTypes } from '@ComponentsRoot/Toastr/ToastrManager';
import { BehaviorSubject } from 'rxjs';
import ConfigManager from './ConfigManager';
export default class BaseBloc<T> {
  subject: BehaviorSubject<T>;
  data: T;
  configManager: ConfigManager;

  constructor(subjectData: T) {
    this.data = subjectData;
    this.subject = this.initRxjsSubject();
    this.configManager = new ConfigManager();
  }

  initRxjsSubject = () => {
    return new BehaviorSubject<T>(this.data);
  };

  getBlocSubjectAsObservable = () => {
    return this.subject.asObservable();
  };

  getSubjectValue = () => {
    return this.subject.getValue();
  };

  setNextSubjectValue = (newVal: Partial<T>) => {
    const prevState = this.getSubjectValue();
    this.subject.next({
      ...prevState,
      ...newVal,
    });
  };

  setErrorOnBloc = (err: any) => {
    this.subject.next({
      ...this.getSubjectValue(),
      hasError: err,
      isLoading: false,
    });
  };

  setLoading = (value?: boolean) => {
    this.subject.next({
      ...this.getSubjectValue(),
      isLoading: value !== undefined ? value : true,
    });
  };

  setToastrObj = (toastrType: Partial<toastrTypes>, msg: string, hrefTo?: string) => {
    // const prevState = this.getSubjectValue();
    return { ...(this.getSubjectValue() as any).toastr, [toastrType]: { show: true, textId: msg, ...(hrefTo && { hrefTo }) } };
  };
}
