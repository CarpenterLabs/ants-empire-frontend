import TavernBloc from '../bloc/TavernBloc';
import { renderLoaderIfNeeded } from '@Layout/components/AntsLoader';
import { renderToastrIfNeeded } from '@ComponentsRoot/Toastr/ToastrManager';
import { useEffect } from 'react';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import CustomModal from '@ComponentsRoot/core/CustomModal';
import ColonyBloc from '@ComponentsRoot/Colony/bloc/ColonyBloc';
import { TavernSubject } from '../types/TavernSubject';
import Style from '../styles/TavernView.module.scss';
import FarmingNPCCard from './FarmingNPCView';
// import { materialEmojisRelation } from '@ComponentsRoot/MaterialBox/types/MaterialBoxToBuy';
import { maxDecimals } from '@ComponentsRoot/core/CryptoAntsUtils';
import { BaseRoomType, WareHouse } from '@ComponentsRoot/Colony/types/RoomType';
import { useOutletContext } from 'react-router-dom';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { FarmingNPC } from '../types/farmingNPC/FarmingNPC';
import RevealPackModal from '@ComponentsRoot/Expedition/views/RevealPackModal';
import { Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { MATERIAL_LIST } from '@ComponentsRoot/constants/iconLists';

const TavernView = (props: {
  subjectValue: TavernSubject;
  colonyData: Colony;
  bloc: TavernBloc;
  isOpen: boolean;
  refreshColonyData: ColonyBloc['refreshColonyData'];
}) => {
  // Outlet context const declaration, that way we can access the top level context wihtout passing it as a prop
  const outletContext: OutletContextType = useOutletContext<OutletContextType>();

  useEffect(() => {
    if (props.isOpen) {
      (async () => {
        await props.bloc.getTavernData();
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  const mountTavernModalHeader = () => {
    return (
      <div className={Style.tavernModalHeader}>
        <div className='mainHeader'>
          <div className='modalTitle'>
            <p>Tavern</p>
          </div>
        </div>
      </div>
    );
  };

  const mountTavernBody = () => {
    return (
      <div className={`${Style.tavernView} fadeIn`}>
        <div className='colonyMaterials'>
          <div className='mainInfo'>
            {/* <div className='colonyLvl'>🏕️Colony Lvl {props.colonyData.level}</div> */}
            <div className='warehouseCapacity'>
              <img style={{ width: '30px' }} src='/images/finals/icons/storage.png' alt='storage' />
              {`${maxDecimals(props.bloc.calculateSumMaterialsOnColony(props.colonyData.materials))} / ${
                (props.colonyData.rooms.find((room: BaseRoomType) => room.roomId === 5) as WareHouse).currentCapacityByLevel
              }`}
            </div>
          </div>

          <div className='others'>
            <div className='materials'>
              {props.colonyData?.materials.map((material) => (
                <div className={`box-type type-${material.materialId}`} key={material.materialId}>
                  <div className={`material type-${material.materialId}`}>
                    {/* <span>{materialEmojisRelation[material.materialId]}</span> */}
                    <span>
                      {material.materialId === 0 ? (
                        <img alt='Nectar Logo' style={{ width: '25px' }} src={`/images/finals/icons/nectar.png`} />
                      ) : (
                        <img
                          alt={MATERIAL_LIST.find((m) => m.id === material.materialId)?.alt}
                          // style={{ width: '30px' }}
                          src={MATERIAL_LIST.find((m) => m.id === material.materialId)?.src}
                        />
                      )}
                    </span>
                    <div className='text'>
                      <span>{`${maxDecimals(Number(material.value))}`}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='colonyNectar'>
              <div className='nectar'>
                <img alt='Nectar Logo' style={{ width: '25px' }} src={`/images/finals/icons/nectar.png`} />
                {outletContext.accountData?.nectar?.toFixed(3)}
              </div>
            </div>
          </div>
        </div>

        <div className='npcsContainer'>
          {props.subjectValue.npcsData!.map((npc: FarmingNPC, key) => (
            <FarmingNPCCard
              executeQuestFn={props.bloc.executeQuest}
              skipQuestFn={props.bloc.skipQuest}
              npc={npc}
              colony={props.colonyData}
              intl={props.bloc.providerProps.intl}
              key={key.toString()}
              refreshQuestData={props.bloc.getTavernData}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderMintPackModalIfNeeded = () => {
    if (props.subjectValue.isOpenMintPackRewardModal && props.subjectValue.mintPackResult) {
      // return <MintPackRewardModal bloc={props.bloc} />;
      return (
        <RevealPackModal
          handleCloseModalFn={props.bloc.toggleMintPackRewardModal}
          intl={props.bloc.providerProps.intl}
          packRevealed={props.subjectValue.mintPackResult.ants}
          extraJSXOnBody={
            <>
              <FormattedMessage id='mintPackReward.antsSendedToInventory' />
            </>
          }
          button={
            <Button color='primary' onClick={props.bloc.toggleMintPackRewardModal}>
              <FormattedMessage id='general.close' />
            </Button>
          }
        />
      );
    }
    return <></>;
  };

  return (
    <>
      {props.isOpen && (
        <>
          {props.subjectValue.npcsData && (
            <>
              <CustomModal
                largeHeader
                class={`xxl tavernModalMain`}
                size={'xl'}
                modalBodyClassName={'modalQuestsBody'}
                body={mountTavernBody()}
                open
                title={mountTavernModalHeader()}
                togglerModal={() => props.bloc.closeModal()}
              />
            </>
          )}
        </>
      )}
      {renderLoaderIfNeeded(props.subjectValue.isLoading)}
      {renderToastrIfNeeded(props.subjectValue.toastr, props.bloc.resetSubjectActions, props.bloc.providerProps.intl)}
      {renderMintPackModalIfNeeded()}
    </>
  );
};

export default TavernView;
