import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import CustomModal from '@ComponentsRoot/core/CustomModal';
// import { AntsLoader } from '@Layout/components/AntsLoader';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { Button } from 'reactstrap';
import Style from '../styles/AntDetail.module.scss';
import ColonyBloc from '@ComponentsRoot/Colony/bloc/ColonyBloc';

const AntDetailView = (props: {
  ant: Ant;
  onCloseFn: () => void;
  onClickSellAnt?: (ant: Ant) => void;
  sendToInventory?: ColonyBloc['sendAntToInventory'];
}) => {
  const intl: IntlShape = useIntl();

  const mountMainModalBody = () => {
    return (
      <>
        <div className={Style.AntDetail}>
          <div className='general-box'>
            <div className='pHeader'>{props.ant._id}</div>
            <div className={`ant-img ${props.ant.rarity}`}>
              <img alt={'Ant Img'} /*className={`specie ${props.ant.specie}`}*/ src={`/images/antProfileNoBg.png`} />
            </div>
            <div className={`ant-detail ${props.ant.rarity}`}>
              <div className='box-type'>
                <div className='box-rarity'>
                  <div className='rarity'>
                    <div className={`inside ${props.ant.rarity}`}>{props.ant.rarity.substring(0, 1).toLocaleUpperCase()}</div>
                  </div>
                </div>
                <div className='power'>
                  <span className={`rarity-${props.ant.rarity}`}>{props.ant.power}</span>
                </div>
                <img alt={props.ant.type} className={`type ${props.ant.type}`} src={`/images/${props.ant.type}.png`} />
                {/* <img alt={props.ant.specie} className={`specie ${props.ant.specie}`} src={`/images/leaf.png`} /> */}
              </div>
            </div>
            <div className='mainText'>
              <p className='room'>
                Room: {props.ant.roomid !== 0 ? props.ant.roomid : intl.formatMessage({ id: 'general.notAssigned' })}
              </p>
              <p className='colony'>
                Colony: {props.ant.colonyId !== '0' ? props.ant.colonyId : intl.formatMessage({ id: 'general.notAssigned' })}
              </p>
              <p className='owner'>Owner: {props.ant.owner}</p>
              <p className='owner'>NftId: {props.ant.tokenId}</p>
            </div>
          </div>
        </div>
      </>
    );
  };

  const getModalTitle = () => {
    return `${intl.formatMessage({ id: 'ant.antWithId' })} ${props.ant._id}`;
  };

  const mountModalFooterBtns = () => {
    return (
      <>
        {/* to implement market funcionality */}
        {props.onClickSellAnt && (
          <Button disabled={props.ant.inMarket} color='primary' onClick={async (e) => await props.onClickSellAnt!(props.ant)}>
            {props.ant.inMarket ? <FormattedMessage id='market.inMarket' /> : <FormattedMessage id='ant.sell' />}
          </Button>
        )}

        {props.sendToInventory && (
          <Button color='warning' style={{ color: 'white' }} onClick={async (e) => await props.sendToInventory!(props.ant._id!)}>
            <FormattedMessage id='general.sendToInventory' />
            {props.ant.usedtimes > 0 ? <span> (-1 🩹)</span> : <></>}
          </Button>
        )}

        <Button color='info' style={{ color: 'white' }} onClick={props.onCloseFn}>
          <FormattedMessage id='general.close' />
        </Button>
      </>
    );
  };

  const renderMainModal = () => {
    return (
      <>
        <CustomModal
          body={mountMainModalBody()}
          open
          size='md'
          title={getModalTitle()}
          footer={mountModalFooterBtns()}
          togglerModal={props.onCloseFn}
          withoutHeader={true}
        />
      </>
    );
  };

  return renderMainModal();
};

export default AntDetailView;
