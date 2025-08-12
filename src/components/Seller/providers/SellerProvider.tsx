import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
import { PureComponent } from 'react';
import { renderMainErrorHandler } from '@ComponentsRoot/ErrorHandler/provider/ErrorHandlerProvider';
import FallbackLoader from '@Layout/components/FallbackLoader';
import SellerView from '../views/SellerView';
import SellerBloc from '../bloc/SellerBloc';
import { SellerBlocProps } from '../types/SellerSubject';

class SellerProvider extends PureComponent<SellerBlocProps> {
  private readonly bloc: SellerBloc;

  constructor(props: SellerBlocProps) {
    super(props);
    this.bloc = new SellerBloc(this.props);
  }

  componentDidMount() {
    if (this.props.swapModal) {
      this.bloc.toggleSwapModal();
    }
  }

  componentDidUpdate(prevProps: SellerBlocProps) {
    if (prevProps.swapModal !== this.props.swapModal) {
      this.bloc.toggleSwapModal();
    }
  }

  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.connectionState !== -1) {
      return (
        <>
          <SellerView
            subjectValue={snapshot.data}
            bloc={this.bloc}
            sellerData={this.props.data}
            sellerDialog={this.props.sellerDialog}
            swapModal={this.props.swapModal}
            colony={this.props.colony}
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

export default SellerProvider;
