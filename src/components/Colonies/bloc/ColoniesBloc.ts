import { ColoniesSubject, defaultDataSubjectColonies } from '../types/ColoniesSubject';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import ColonyRepository from '@Repositories/ColonyRepository';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';

export default class ColoniesBloc extends BaseBloc<ColoniesSubject> {
  coloniesRepository: ColonyRepository;
  providerProps: OutletContextType;
  constructor(props: OutletContextType) {
    super(defaultDataSubjectColonies);
    this.providerProps = props;
    this.coloniesRepository = props.repositoryManager.getColonyRepository();
  }

  getColoniesData = async () => {
    try {
      this.setNextSubjectValue({ isLoading: true });
      this.setNextSubjectValue({
        coloniesData: await this.coloniesRepository.getUserColonies(),
        isLoading: false,
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  resetSubjectActions = () => {
    this.setNextSubjectValue({ toastr: defaultDataSubjectColonies.toastr });
  };

  resetBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false });
    // this.setNextSubjectValue({ ...defaultDataSubjectColonies });
  };
}
