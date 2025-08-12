import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import Style from '../styles/UIColonyHeader.module.scss';
import { BaseRoomType, WareHouse } from '../types/RoomType';
import { maxDecimals } from '@ComponentsRoot/core/CryptoAntsUtils';
import useIsMobile from '../hooks/useIsMobile';
import { TOOL_LIST, MATERIAL_LIST } from '@ComponentsRoot/constants/iconLists';

const UIColonyHeader = ({ level, farmingTools, rooms, materials, ants_resume }: Colony) => {
  const isMobile = useIsMobile();
  const getTotalAntsPower = () => {
    const antsTotalPower = Object.keys(ants_resume.antsTotalPower).reduce(
      (accumulator, typeKey) => accumulator + ants_resume.antsTotalPower[typeKey],
      0
    );
    return antsTotalPower;
  };

  const wareHouse = rooms.find((r: BaseRoomType) => r.roomId === 5) as WareHouse;

  return (
    <div className={Style.UIColonyHeader}>
      <div className='lvl'>
        <p className='title'>LV</p>
        <p className='value'>{level}</p>
      </div>

      <div className='details'>
        <div className='top-minibar'>
          <div className='power'>
            <p> {isMobile ? ' POWER' : ' TOTAL POWER'}</p> <span>{getTotalAntsPower()}</span>
          </div>
          <div className='tools'>
            {TOOL_LIST.map((tool) => {
              const cnt = farmingTools[tool.id] || 0;
              return (
                <div key={tool.id} className='tool-type'>
                  <div className='farming-tool'>
                    <img src={tool.src} alt={tool.alt} />
                    <div className='count-badge'>{cnt}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='inferior-bar'>
          <div className='total-material'>
            <img src='/images/finals/icons/storage.png' alt='storage' />
            <span className='current'>{wareHouse.currentMaterialTotalCount}</span>{' '}
            <span className='max'>/{wareHouse.currentCapacityByLevel}</span>
          </div>
          <div className='materials'>
            {MATERIAL_LIST.map((mat) => {
              const matData = materials.find((m) => m.materialId === mat.id);
              const val = matData ? maxDecimals(Number(matData.value)) : '0';
              return (
                <div key={mat.id} className='box-type'>
                  <div className='material'>
                    <img src={mat.src} alt={mat.alt} />
                    <div className='count-badge'>{val}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIColonyHeader;
