import CustomModal from '@ComponentsRoot/core/CustomModal';
import { FormattedMessage, IntlShape } from 'react-intl';
import ModalStyle from '@ComponentsRoot/Market/styles/ListAntMarketModal.module.scss';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import AntMiniCard from '@ComponentsRoot/AntList/views/AntMiniCard';
import { Button } from 'reactstrap';
import { InputNumberBase } from '@ComponentsRoot/core/InputNumberBase';
import { useState } from 'react';

const ListAntMarketModal = (props: {
  handleCloseModalFn: () => void;
  intl: IntlShape;
  antToList: Ant;
  triggerListOnSC: (ant: Ant, price: number) => Promise<void>;
}) => {
  const [price, setPrice] = useState<number>(0);

  const getModalBody = () => {
    return (
      <div className={ModalStyle.listAntMarketModal}>
        <div className='mainbody'>
          <div className='list-ants'>
            <AntMiniCard ant={props.antToList} />
          </div>
          <div className='feeText'>
            <FormattedMessage id='market.devFee' />
          </div>
          <div className='priceArea'>
            <FormattedMessage id='market.antPrice' />
            <InputNumberBase className='m-1' maxDecimals={2} value={price} setValueFn={(value: number) => setPrice(value)} />
          </div>
          <div className='button-box'>
            <Button
              disabled={price ? false : true}
              color='primary'
              onClick={async () => await props.triggerListOnSC(props.antToList, price)}
            >
              <FormattedMessage id='market.listAnt' />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const mountModalHeader = () => {
    return (
      <div>
        <div className='assignerHeader'>
          <div>{props.intl.formatMessage({ id: 'market.listAnt' })}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <CustomModal size={'md'} body={getModalBody()} open title={mountModalHeader()} togglerModal={props.handleCloseModalFn} />
    </>
  );
};

export default ListAntMarketModal;
