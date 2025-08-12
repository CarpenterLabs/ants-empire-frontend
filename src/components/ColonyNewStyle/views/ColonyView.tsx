import { useEffect } from 'react';
import ColonyBloc from '../bloc/ColonyBloc';
import { ColonySubject } from '../types/ColonySubject';
import Style from '../styles/colonyView.module.scss';
import { useOutletContext, useParams } from 'react-router-dom';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import UIColonyHeader from './UIColonyHeader';
import BlackSmithProvider from '@ComponentsRoot/BlackSmith/providers/BlackSmithProvider';
import RoomDetail from '@ComponentsRoot/ColonyNewStyle/views/RoomDetail';
import useIsMobile from '../hooks/useIsMobile';
import MapRooms from './MapRooms';
import UpgradeRoom from './UpgradeRoom';
import AntRoomAssigner from './AntRoomAssigner';
import UnlockSpot from './UnlockSpot';
import { renderToastrIfNeeded } from '@ComponentsRoot/Toastr/ToastrManager';
import SellerProvider from '@ComponentsRoot/Seller/providers/SellerProvider';
import TavernProvider from '@ComponentsRoot/Tavern/providers/TavernProvider';
import ModeToggle from './ModeToggleView';
import { useAutoPhase } from '../hooks/useAutoPhase';
import HospitalProvider from '@ComponentsRoot/Hospital/providers/HospitalProvider';
import ExpeditionProvider from '@ComponentsRoot/Expedition/providers/ExpeditionProvider';
import WareHouseModal from './WareHouseModal';
import { PurchasedMaterialBox } from '@ComponentsRoot/MaterialBox/types/PurchasedMaterialBox';
import { BaseRoomType, WareHouse } from '../types/RoomType';
import PowerTicketAntAssigner from '@ComponentsRoot/Expedition/views/PowerTicketAntAssigner';
import UpgradedAntModal from '@ComponentsRoot/Ant/views/UpgradedAntModal';

const ColonyView = (props: { bloc: ColonyBloc; data: ColonySubject }) => {
  const outletContext = useOutletContext<OutletContextType>();
  const setLayoutVariant = outletContext.setLayoutVariant;

  const autoPhase = useAutoPhase(props.data.lightMode, 5000);
  const currentLightMode = props.data.lightMode === 'auto' ? autoPhase : props.data.lightMode;

  const { id } = useParams();
  const isMobile = useIsMobile();

  useEffect(() => {
    props.bloc.getColonyData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLayoutVariant('inColonyDetail');
    return () => setLayoutVariant(null);
  }, [setLayoutVariant]);

  const renderUnlockSpotModal = () => (
    <UnlockSpot
      intl={props.bloc.providerProps.intl}
      unlockSpot={props.bloc.unlockSpot}
      spot={props.data.colonyData?.spots[props.data.selectedSpotToUnlock]}
      isunlockSpotOpen
      materials={props.data.colonyData?.materials!}
      toggleUnlockSpotModal={props.bloc.toggleUnlockSpotModal}
      selectedSpotToUnlock={props.data.selectedSpotToUnlock}
    />
  );

  const renderAddAntsToRoomModal = () => {
    return (
      <AntRoomAssigner
        antsOnInventory={props.data.antsOnInventory!}
        handleCloseModalFn={props.bloc.toggleAddAntsToRoomModal}
        intl={props.bloc.providerProps.intl}
        isAssignerOpen
        room={props.data.selectedRoomToAddAnts!}
        addAntsToColonyRoomFn={props.bloc.addAntsToColonyRoom}
        antsAlreadyInsideRoom={
          props.data.colonyData?.ants
            ? props.data.colonyData?.ants.filter((ant) => ant.roomid === props.data.selectedRoomToAddAnts!.roomId)
            : []
        }
      />
    );
  };

  const renderMapRooms = (isMobile = false) => (
    <MapRooms
      isMobile={isMobile}
      colonyData={props.data.colonyData!}
      handlerManageSpot={props.bloc.handlerManageSpot}
      refreshColonyData={props.bloc.refreshColonyData}
      getOpenDetailModalByRoomId={props.bloc.getOpenDetailModalByRoomId}
      handleClickUpgradeRoomBtn={props.bloc.toggleUpgradeRoomModal}
      toggleCallSellerDialog={props.bloc.toggleCallSellerDialog}
    />
  );

  const renderPowerTicketAssignerIfNeeded = () => {
    if (props.data.isOpenPwrTicketAssignerModal && props.data.purchasedTicketToAssign) {
      return (
        <PowerTicketAntAssigner
          ants={props.data.colonyData?.ants!}
          intl={props.bloc.providerProps.intl}
          purchasedPowerTicket={props.data.purchasedTicketToAssign}
          isPowerTicketAssignerOpen
          handleCloseModalFn={props.bloc.togglePwrTicketAssignerToAntModal}
          addPowerToSelectedAntFn={props.bloc.useQuestPowerTicketOnColony}
        />
      );
    }
    return <></>;
  };

  return (
    <div className={Style.colonyView}>
      {props.data.colonyData ? (
        <div className={`content-colony fadeIn ${currentLightMode}`}>
          {isMobile && <UIColonyHeader {...props.data.colonyData} />}

          <div className='image-container'>
            {!isMobile && (
              <>
                <UIColonyHeader {...props.data.colonyData} />
                {/* {<AutoModeToggle onModeChange={handleMode} />} */}
                {
                  <ModeToggle
                    lightMode={props.data.lightMode}
                    autoPhase={autoPhase}
                    onToggle={(mode) => props.bloc.toggleLightMode(mode)}
                  />
                }
              </>
            )}

            {isMobile ? (
              <div className='mobile'>
                <div className='fullscreen-pattern'>{renderMapRooms(isMobile)}</div>
              </div>
            ) : (
              <>
                <img src='/images/finals/UI_BG_max.png' alt='Colony Background' className='colony-background' />
                {renderMapRooms(isMobile)}
              </>
            )}

            <BlackSmithProvider
              colonyRepository={props.bloc.colonyRepository}
              closeModal={props.bloc.toggleBlackSmithDialog}
              intl={props.bloc.providerProps.intl}
              refreshColonyData={props.bloc.refreshColonyData}
              colonyData={props.data.colonyData}
              isOpen={props.data.blackSmithModalVisible}
            />

            {props.data.clickedRoomId && (
              <RoomDetail
                room={props.data.colonyData.rooms.find((r) => r.roomId === props.data.clickedRoomId)!}
                isRoomDetailOpen={props.data.roomDetailModalOpen}
                toggleUpgradeRoomModal={props.bloc.toggleUpgradeRoomModal}
                handleCloseModalFn={() => props.bloc.toggleDormitoryRoom(undefined)}
                intl={props.bloc.providerProps.intl}
                ants={props.data.colonyData.ants?.filter((ant) => ant.roomid === props.data.clickedRoomId) || []}
                toggleAddAntsModal={props.bloc.handleOpenAddAntToRoomModal}
              />
            )}

            {props.data.isWareHouseModalOpen ? (
              <WareHouseModal
                room={props.data.colonyData.rooms.find((room: BaseRoomType) => room.roomId === 5) as WareHouse}
                handleCloseModalFn={props.bloc.toggleWareHouseModal}
                mBoxes={props.data.colonyData!.purchasedMaterialBoxes}
                purchasedTickets={props.data.colonyData!.purchasedPwrTickets.filter(
                  (ticket) => !ticket.destinationId && !ticket.used
                )}
                onClickPowerTicketCard={props.bloc.handleClickMiniPwrTicketCard}
                handleOpenPurchasedMaterialBox={async (mBox: PurchasedMaterialBox) =>
                  await props.bloc.handleOpenPurchasedMaterialBox(mBox, id as string)
                }
                isWareHouseModalOpen
                intl={props.bloc.providerProps.intl}
              />
            ) : (
              <></>
            )}

            {props.data.unlockSpotModal && renderUnlockSpotModal()}

            <UpgradeRoom
              intl={props.bloc.providerProps.intl}
              colonyData={props.data.colonyData}
              isUpgradeRoomOpen={props.data.upgradeRoomModal}
              room={props.data.colonyData?.rooms.find((room) => room.roomId === props.data.selectedRoomToUpgrade)!}
              toggleUpgradeRoomModal={props.bloc.toggleUpgradeRoomModal}
              upgradeRoom={props.bloc.upgradeRoom}
            />

            {props.data.addAntsToRoomModalVisible && props.data.antsOnInventory && props.data.selectedRoomToAddAnts
              ? renderAddAntsToRoomModal()
              : ''}

            {props.data.colonyData.seller.available && (
              <SellerProvider
                data={props.data.colonyData.seller}
                colonyBloc={props.bloc}
                sellerDialog={props.data.sellerDialog}
                swapModal={props.data.swapModal}
                repositoryManager={props.bloc.providerProps.repositoryManager}
                colony={props.data.colonyData}
              />
            )}
            <TavernProvider
              closeModal={props.bloc.toggleTavernModal}
              intl={props.bloc.providerProps.intl}
              isOpen={props.data.tavernModalVisible}
              colonyData={props.data.colonyData}
              refreshColonyData={props.bloc.refreshColonyData}
              farmingQuestRepository={props.bloc.providerProps.repositoryManager.farmingQuestRepository}
              wPackRepo={props.bloc.providerProps.repositoryManager.welcomePackRepository}
              refreshAccountDataFn={props.bloc.providerProps.refreshAccountDataFn}
            />

            {props.data.HospitalModalVisible ? (
              <HospitalProvider
                colonyRepository={props.bloc.colonyRepository}
                closeModal={props.bloc.toggleHospitalDialog}
                intl={props.bloc.providerProps.intl}
                refreshColonyData={props.bloc.refreshColonyData}
                colonyData={props.data.colonyData}
                isOpen={props.data.HospitalModalVisible}
                restoreUsedTimes={props.bloc.restoreUsedTimes}
                buyRestorePack={props.bloc.buyRestorePack}
              />
            ) : (
              ''
            )}

            {props.data.expeditionsModalVisible ? (
              <ExpeditionProvider
                colonyRepository={props.bloc.colonyRepository}
                closeModal={props.bloc.toggleExpeditionsDialog}
                toggleDetailDestinationModal={props.bloc.toggleDetailDestinationDialog}
                restartExpeditions={props.bloc.restartExpeditions}
                intl={props.bloc.providerProps.intl}
                colonyData={props.data.colonyData}
                isOpen={props.data.expeditionsModalVisible}
                detailIsOpen={props.data.DetailDestinationModalVisible}
                refreshAccountDataFn={props.bloc.providerProps.refreshAccountDataFn}
                refreshColonyData={props.bloc.refreshColonyData}
              />
            ) : (
              ''
            )}

            {renderToastrIfNeeded(props.data.toastr, props.bloc.resetSubjectActions, props.bloc.providerProps.intl)}
            {renderPowerTicketAssignerIfNeeded()}

            {/* // SHOW MODAL OF THE EXCHANGED POWER TICKET RESULT */}
            {props.data.pwrTicketUpgradeResult && (
              <UpgradedAntModal
                intl={props.bloc.providerProps.intl}
                ant={props.data.pwrTicketUpgradeResult}
                handleCloseModalFn={props.bloc.closeUpgradedAntModal}
              />
            )}
          </div>
        </div>
      ) : (
        <p>Loader here......</p>
      )}
    </div>
  );
};

export default ColonyView;
