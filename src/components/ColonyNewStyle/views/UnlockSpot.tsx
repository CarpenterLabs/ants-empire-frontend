import CustomModal from '@ComponentsRoot/core/CustomModal';
import { FormattedMessage, IntlShape } from 'react-intl';
import Style from '../styles/unlockSpot.module.scss';
import { Button } from 'reactstrap';
import ColonyBloc from '../bloc/ColonyBloc';
import { ColonySubject } from '../types/ColonySubject';
import { SpotType } from '../types/SpotType';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import { MATERIAL_LIST } from '@ComponentsRoot/constants/iconLists';

const UnlockSpot = (props: {
  intl: IntlShape;
  unlockSpot: ColonyBloc['unlockSpot'];
  toggleUnlockSpotModal: ColonyBloc['toggleUnlockSpotModal'];
  isunlockSpotOpen: boolean;
  selectedSpotToUnlock: ColonySubject['selectedSpotToUnlock'];
  spot: SpotType;
  materials: Colony['materials'];
}) => {
  const mountModalFooterBtns = () => {
    return (
      <>
        <Button
          disabled={!props.spot.unlockableWithMaterials}
          color='primary'
          className='upgradeBtn'
          onClick={async () => await props.unlockSpot(props.selectedSpotToUnlock)}
        >
          <FormattedMessage id='colony.spot.unlock.accept' />
        </Button>
      </>
    );
  };

  const mountUnlockSpotModalBody = () => {
    //const roomSelected = props.data.colonyData?.rooms.find((room) => room.roomId === props.data.selectedRoomToUpgrade);
    if (props.spot) {
      return (
        <div className={`${Style.gridUpgrade} fadeIn`}>
          <div className='reqs'>
            {props.spot.costUnlock.map((requeriment, key) => {
              const materialSelected = props.materials.find((material) => material.materialId === requeriment.materialId)!.value;
              return (
                <div
                  key={key}
                  className={`material-required ${
                    materialSelected !== undefined && materialSelected < requeriment.quantity ? 'unavailable' : ''
                  }`}
                >
                  <div className={`material-box type-${requeriment.materialId}`}>
                    <span>
                      {requeriment.materialId === 0 ? (
                        <img alt='Nectar Logo' style={{ width: '35px' }} src={`/images/finals/icons/nectar.png`} />
                      ) : (
                        <img
                          alt={MATERIAL_LIST.find((m) => m.id === requeriment.materialId)?.alt}
                          src={MATERIAL_LIST.find((m) => m.id === requeriment.materialId)?.src}
                        />
                      )}
                    </span>
                  </div>
                  <span className='text'>{requeriment.quantity}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return <p></p>;
    }
  };

  return (
    <>
      {props.isunlockSpotOpen && (
        <CustomModal
          body={mountUnlockSpotModalBody()}
          open
          size='md'
          class='upgrade-modal'
          title={<FormattedMessage id='colony.spot.unlock.title' />}
          footer={mountModalFooterBtns()}
          togglerModal={props.toggleUnlockSpotModal}
          modalHeaderClassName='standarModalHeader'
        />
      )}
    </>
  );
};

export default UnlockSpot;
