import { SpotsItemPosition } from '../types/SpotType';
import { MaterialPosition, spotsInfo } from '../types/Colony';
import { Spot } from './Spot';
import { SpotType } from '@ComponentsRoot/Colony/types/SpotType';
import Style from '../styles/spotsView.module.scss';

export const SpotsView = (props: { roomId: number; isVisible: boolean; spotsInfo: spotsInfo }) => {
  const { roomId, isVisible, spotsInfo } = props;
  const { colonyData } = spotsInfo;

  // Solo mostrar en la room Collection (id 8)
  if (roomId !== 7 || !isVisible) {
    return null;
  }

  const spotsItemsData: SpotsItemPosition[] = [
    { id: 1, src: '/images/finals/spots/1.png', top: 28, left: 7, width: 8.5 },
    { id: 2, src: '/images/finals/spots/2.png', top: 27.5, left: 16, width: 8 },
    { id: 3, src: '/images/finals/spots/3.png', top: 27, left: 24.8, width: 8 },
    { id: 4, src: '/images/finals/spots/4.png', top: 28, left: 33.2, width: 7.5 },
    { id: 5, src: '/images/finals/spots/5.png', top: 26, left: 41.5, width: 8 },
    { id: 6, src: '/images/finals/spots/6.png', top: 26, left: 50, width: 8.5 },
    { id: 7, src: '/images/finals/spots/7.png', top: 25.5, left: 58.6, width: 7.7 },
    { id: 8, src: '/images/finals/spots/8.png', top: 26, left: 66.8, width: 8 },
    { id: 9, src: '/images/finals/spots/9.png', top: 25.5, left: 75.7, width: 8 },
    { id: 10, src: '/images/finals/spots/10.png', top: 26.5, left: 84, width: 8 },

    { id: 11, src: '/images/finals/spots/11.png', top: 48, left: 6.5, width: 9 },
    { id: 12, src: '/images/finals/spots/12.png', top: 46.5, left: 16, width: 8 },
    { id: 13, src: '/images/finals/spots/13.png', top: 48, left: 24.5, width: 8 },
    { id: 14, src: '/images/finals/spots/14.png', top: 47, left: 33, width: 7.5 },
    { id: 15, src: '/images/finals/spots/15.png', top: 48.5, left: 41, width: 8 },
    { id: 16, src: '/images/finals/spots/16.png', top: 47.5, left: 49.5, width: 8.5 },
    { id: 17, src: '/images/finals/spots/17.png', top: 48.5, left: 58.5, width: 8 },
    { id: 18, src: '/images/finals/spots/18.png', top: 48, left: 66.5, width: 8 },
    { id: 19, src: '/images/finals/spots/19.png', top: 49, left: 75.5, width: 8 },
    { id: 20, src: '/images/finals/spots/20.png', top: 48.5, left: 84, width: 8.7 },
  ];

  const materialAdjustments: MaterialPosition[] = [
    { spotId: 1, top: 53, left: 50 },
    { spotId: 2, top: 60, left: 50 },
    { spotId: 3, top: 60, left: 50 },
    { spotId: 4, top: 48, left: 53 },
    { spotId: 5, top: 45, left: 53 },
    { spotId: 6, top: 48, left: 50 },
    { spotId: 7, top: 52, left: 50 },
    { spotId: 8, top: 45, left: 50 },
    { spotId: 9, top: 49, left: 50 },
    { spotId: 10, top: 43, left: 50 },

    { spotId: 11, top: 50, left: 57 },
    { spotId: 12, top: 60, left: 50 },
    { spotId: 13, top: 56, left: 50 },
    { spotId: 14, top: 57, left: 50 },
    { spotId: 15, top: 49, left: 50 },
    { spotId: 16, top: 53, left: 50 },
    { spotId: 17, top: 54, left: 50 },
    { spotId: 18, top: 56, left: 50 },
    { spotId: 19, top: 50, left: 50 },
    { spotId: 20, top: 47, left: 50 },
  ];

  let unLockedCount = 0;

  return (
    <div className={Style.collectionMap}>
      {Object.keys(colonyData.spots).map((spotKey, key) => {
        const spotSelected: SpotType = colonyData.spots[spotKey];
        const spotItemData = spotsItemsData.find((item) => item.id === Number(spotKey))!;
        const materialAdjustment = materialAdjustments.find((adj) => adj.spotId === Number(spotKey));

        if (!spotSelected.unlocked) {
          unLockedCount++;
        }

        return (
          <Spot
            key={key}
            id={spotItemData.id}
            top={spotItemData.top}
            left={spotItemData.left}
            width={spotItemData.width}
            spot={spotSelected}
            unLockedCount={unLockedCount}
            spotsInfo={spotsInfo}
            spotImageSrc={spotItemData.src}
            materialAdjustment={materialAdjustment}
          />
        );
      })}
    </div>
  );
};
