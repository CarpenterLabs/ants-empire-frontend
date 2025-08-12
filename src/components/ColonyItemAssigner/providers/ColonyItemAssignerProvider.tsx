import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
import { PureComponent } from 'react';
import { renderMainErrorHandler } from '@ComponentsRoot/ErrorHandler/provider/ErrorHandlerProvider';
import FallbackLoader from '@Layout/components/FallbackLoader';
import ColonyItemAssignerBloc from '../bloc/ColonyItemAssignerBloc';
import ColonyItemAssignerView from '../views/ColonyItemAssignerView';
import { InventoryItemPropsType } from '@ComponentsRoot/Inventory/types/InventoryItemPropsType';
import { IntlShape } from 'react-intl';
import ColonyRepository from '@Repositories/ColonyRepository';

export type ColonyItemAssignerProviderPropsType = {
  itemsToAssign: InventoryItemPropsType['item'][];
  cancelHandler: () => void;
  intl: IntlShape;
  colonyRepository: ColonyRepository;
  afterAssignFn: (colonyId: string) => Promise<void>;
  autoAssignWhenOpen: boolean;
};

class ColonyItemAssignerProvider extends PureComponent<ColonyItemAssignerProviderPropsType> {
  private readonly bloc: ColonyItemAssignerBloc;

  constructor(props: ColonyItemAssignerProviderPropsType) {
    super(props);
    this.bloc = new ColonyItemAssignerBloc(this.props);
  }

  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.connectionState !== -1) {
      return (
        <>
          <ColonyItemAssignerView
            cancelHandler={this.props.cancelHandler}
            itemsToAssign={this.props.itemsToAssign}
            data={snapshot.data}
            bloc={this.bloc}
            autoAssignWhenOpen={this.props.autoAssignWhenOpen}
          />
          {snapshot.data.hasError && renderMainErrorHandler(snapshot, this.bloc.resetBloc)}
        </>
      );
    } else {
      return <FallbackLoader />;
    }
  };

  render() {
    return <CryptoAntsBlocBuilder subject={this.bloc.getBlocSubjectAsObservable()} builder={this.handleSnapshotChange} />;
  }
}

export default ColonyItemAssignerProvider;
