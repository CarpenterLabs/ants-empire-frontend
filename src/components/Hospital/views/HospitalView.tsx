import HospitalBloc from '../bloc/HospitalBloc';
import { HospitalSubject } from '../types/HospitalSubject';
import { renderLoaderIfNeeded } from '@Layout/components/AntsLoader';
import { renderToastrIfNeeded } from '@ComponentsRoot/Toastr/ToastrManager';
import Style from '../styles/hospitalView.module.scss';
import { useEffect } from 'react';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import CustomModal from '@ComponentsRoot/core/CustomModal';
import { Hospital } from '@ComponentsRoot/Colony/types/RoomType';
import { Button } from 'reactstrap';
import AntWithUsedTimesMiniCard from '@ComponentsRoot/AntList/views/AntWithUsedTimesMiniCard';
import { useOutletContext } from 'react-router-dom';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';

const HospitalView = (props: {
  bloc: HospitalBloc;
  subjectValue: HospitalSubject;
  hospital: Hospital;
  colonyData: Colony;
  isOpen: boolean;
}) => {
  const outletContext: OutletContextType = useOutletContext<OutletContextType>();
  const initialHospitalData = props.subjectValue.initialHospitalData ? props.subjectValue.initialHospitalData : {};
  const packImages: Record<number, string> = {
    1: 'bandage.png',
    2: 'stimulant.png',
    3: 'medical-kit.png',
    4: 'recovery-treatment.png',
  };

  useEffect(() => {
    props.bloc.setHospitalAntsAndPool(props.colonyData, props.hospital);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.colonyData]);

  const renderPacks = () => {
    return props.hospital.packs_usedtimes.map((pack, key) => {
      const imageName = packImages[pack.pack_id] || 'bandage.png';

      return (
        <div key={key} className='ticket-pack'>
          <div className='body-ticket'>
            <div className='material'>
              <img src={`/images/finals/icons/${imageName}`} alt={pack.name} />
            </div>
            <div className='text'>
              <p className='pack-desc'>
                {props.bloc.providerProps.intl.formatMessage({
                  id: `colony.room.hospital.${pack.name}`,
                })}
              </p>
              <p className='pack-name'>
                {`${pack.usedtimes} ${props.bloc.providerProps.intl.formatMessage({
                  id: 'colony.room.hospital.usedtimes',
                })}`}
              </p>
            </div>
          </div>
          <div className='box-buy'>
            <div className='cost'>
              <div className={`material-required`}>
                <div className='price'>
                  {pack.price !== pack.priceWithDiscountApplied && <div className='old-price'>${pack.price}</div>}
                  <div className='final-price'>
                    <span className='dollar'>$</span>
                    {pack.priceWithDiscountApplied}
                  </div>
                </div>
              </div>
            </div>
            <div className='buyToolButton-box'>
              <Button
                className='buyToolButton'
                onClick={async () => await props.bloc.buyRestorePack(pack, props.colonyData._id, outletContext)}
              >
                <img className='cartPic' src='/images/finals/icons/cart.png' alt='Cart' />
              </Button>
            </div>
          </div>
        </div>
      );
    });
  };

  const renderFooterLvls = () => {
    const restoreByLevels = props.hospital.restore_by_levels;
    const levels = Object.keys(restoreByLevels);
    const renderedLvls: JSX.Element[] = [];

    let currentRangeStart = parseInt(levels[0]);
    let currentDiscount = restoreByLevels[currentRangeStart].discount;

    const lvlRangeUsed: string[] = [];

    for (let i = 1; i <= levels.length; i++) {
      const lvl = parseInt(levels[i]) || currentRangeStart;
      const nextLevelDiscount = restoreByLevels[lvl].discount;

      let lvlRange = `${currentRangeStart}`;

      if (lvl !== currentRangeStart + 1) {
        lvlRange += lvl - 1 !== currentRangeStart ? `-${lvl - 1}` : '';
      }

      if (nextLevelDiscount !== currentDiscount) {
        const discountElementKey = `${currentRangeStart}-${lvl - 1}`;
        if (!lvlRangeUsed.includes(discountElementKey)) {
          const discountClassName = `box-lvl discount ${Number(props.hospital.level) >= currentRangeStart ? 'current' : ''}`;
          renderedLvls.push(
            <div className={discountClassName} key={discountElementKey}>
              <p className='lvl'>{`${props.bloc.providerProps.intl.formatMessage({ id: 'GENERAL.lvl' })} ${lvlRange}`}</p>
              <p className='text'>
                <b>{currentDiscount}%</b>
              </p>
            </div>
          );
          lvlRangeUsed.push(discountElementKey);
        }
        currentDiscount = nextLevelDiscount;
        currentRangeStart = lvl;
      }
    }

    // Check if the last level should be rendered
    const lastLvlRange = `${currentRangeStart}${
      currentRangeStart !== parseInt(levels[levels.length - 1]) ? `-${levels[levels.length - 1]}` : ''
    }`;
    if (!lvlRangeUsed.includes(lastLvlRange)) {
      const discountClassName = `box-lvl discount ${Number(props.hospital.level) >= currentRangeStart ? 'current' : ''}`;
      renderedLvls.push(
        <div className={discountClassName} key={lastLvlRange}>
          <p className='lvl'>{`${props.bloc.providerProps.intl.formatMessage({ id: 'GENERAL.lvl' })} ${lastLvlRange}`}</p>
          <p className='text'>
            <b>{currentDiscount}%</b>
          </p>
        </div>
      );
    }

    return renderedLvls;
  };

  const renderAnts = () => {
    return props.subjectValue.antsAvailableOnHospital.map((antSelected, key) => (
      <AntWithUsedTimesMiniCard
        key={key}
        ant={antSelected}
        changeUsedTimesValue={props.bloc.changeUsedTimesValue}
        originalPool={props.hospital.healPool}
        currentPool={props.subjectValue.currentPool}
        colony={props.colonyData}
      />
    ));
  };

  const mountHospitalBody = () => {
    return (
      <div className={`${Style.hospitalView} fadeIn`}>
        <div className='general-hospital-container'>
          <div className='header'>
            <div className='image'>
              <img className='hospitalPic' src={`/images/finals/npcs/Spider_Doctor_custom.png`} alt='Spider Doctor' />
            </div>
            <div className='right-container'>
              <div className='tickets-container'>
                <div className='shop-tickets'>{renderPacks()}</div>
              </div>
              <div className='discount-box'>
                <div className='title-discount'>
                  <p>Discount by Level</p>
                </div>
                <div className='footer-lvls'>{renderFooterLvls()}</div>
              </div>
            </div>
          </div>

          <div className='ants-container'>
            <div className={`current-pool ${props.subjectValue.currentPool === 0 && 'empty'}`}>
              <div className='left-box'>
                <span className='pool-value'>
                  {props.bloc.providerProps.intl.formatMessage({ id: 'colony.room.hospital.currentpool' })}:{' '}
                  <span className='value'>{props.subjectValue.currentPool}</span>
                </span>
              </div>

              <div className='right-box'>
                <img
                  className={`button-undo ${props.subjectValue.buttonCureIsDisabled ? 'disabled' : ''}`}
                  onClick={() => props.bloc.resetHospital(initialHospitalData)}
                  src='/images/finals/seller/refresh_btn.png'
                  alt='reset'
                />
                <Button
                  className='cure-btn'
                  disabled={props.subjectValue.buttonCureIsDisabled}
                  onClick={async () =>
                    await props.bloc.restoreUsedTimes(props.subjectValue.antsAvailableOnHospital, props.colonyData)
                  }
                >
                  {props.bloc.providerProps.intl.formatMessage({ id: 'colony.room.hospital.restoreBtn' })}
                </Button>
              </div>
            </div>
            <div className='group-ants'>{renderAnts()}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {props.isOpen && (
        <CustomModal
          size={'lg'}
          modalHeaderClassName='standarModalHeader'
          modalBodyClassName='hospitalModalBody'
          class='withWhiteBorder'
          body={mountHospitalBody()}
          open
          title={props.bloc.providerProps.intl.formatMessage({ id: 'colony.hospital' })}
          togglerModal={() => props.bloc.closeModal(initialHospitalData)}
        />
      )}
      {renderLoaderIfNeeded(props.subjectValue.isLoading)}
      {renderToastrIfNeeded(props.subjectValue.toastr, props.bloc.resetSubjectActions, props.bloc.providerProps.intl)}
    </div>
  );
};

export default HospitalView;
