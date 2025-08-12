import { FormattedMessage } from 'react-intl';
import RangeSlider from 'react-bootstrap-range-slider';
import { Input } from 'reactstrap';
import { Material } from '@ComponentsRoot/Colony/types/Material';
import { BaseRoomType, WareHouse } from '@ComponentsRoot/Colony/types/RoomType';
import { swapMaterials } from '../types/SellerSubject';
import Style from '../styles/sellerModalView.module.scss';
import { SellerModalViewProps } from '../types/Seller';
import { maxDecimals } from '@ComponentsRoot/core/CryptoAntsUtils';
import { MATERIAL_LIST } from '@ComponentsRoot/constants/iconLists';
import { Button } from 'reactstrap';

const SellerModalView = ({ colony, sellerData, subjectValue, bloc }: SellerModalViewProps) => {
  const warehouseRoom = colony.rooms.find((room: BaseRoomType) => room.roomId === 5) as WareHouse;
  const currentCount =
    subjectValue.tempSwapMaterials.capacityWarehouse.swapCount === null
      ? bloc.calculateTotalMaterials(colony.materials)
      : subjectValue.tempSwapMaterials.capacityWarehouse.swapCount;

  return (
    <div className={`${Style.sellerModalView} fadeIn`}>
      <div className='column-left'>
        <div className='container-img'>
          <img className='sellerPic' src={`/images/finals/npcs/Gecko.png`} alt='seller' />
        </div>
        <div className='container-price'>
          <div className='container-title'>Price table by material</div>
          <div className='container-prices'>
            <div className='grid-materials'>
              {MATERIAL_LIST.map((mat) => {
                const matData = colony.materials.find((m) => m.materialId === mat.id);
                return (
                  <div
                    key={mat.id}
                    className={`box-material ${!sellerData.materials.idMaterial.includes(mat.id) ? 'unavailable' : ''}`}
                  >
                    <div className='material'>
                      <img src={mat.src} alt={mat.alt} />
                    </div>
                    <div className='internal-box'>
                      <span className='value'>{matData?.internalValue}</span> <span className='text'>internals</span>
                    </div>
                  </div>
                );
              })}

              <div className='box-material discount'>
                <div className='material'>
                  <img src={`/images/finals/seller/disc.png`} alt='discount' />
                </div>
                <div className='internal-box'>
                  <span className='value'>{sellerData.materials.discount || 0}%</span> <span className='text'>discount</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='column-right'>
        <div className='bar-info'>
          <div className='inferior-bar'>
            <div className='total-material'>
              <img src='/images/finals/icons/storage.png' alt='storage' />
              <p>Capacity</p>
              <span className={`current ${currentCount >= warehouseRoom.currentCapacityByLevel! ? 'red' : ''}`}>
                {maxDecimals(currentCount)}
              </span>
              <span className='max'>/{warehouseRoom.currentCapacityByLevel}</span>
            </div>
            <div className='materials'>
              {MATERIAL_LIST.map((mat) => {
                const matData = colony.materials.find((m) => m.materialId === mat.id);
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
        <div className='container-swap'>
          <div className='user-materials'>
            <div className='swap-box'>
              <div className='title user'>
                <div className='title-text'>
                  <FormattedMessage id={`seller.yourMaterials`} />
                </div>
                <div className='title-icon'>
                  <img
                    className={`button-undo ${subjectValue.tempSwapMaterials.user.total === 0 ? 'disabled' : ''}`}
                    onClick={() => bloc.resetSwap('user')}
                    src='/images/finals/seller/refresh_btn.png'
                    alt='your materials'
                  />
                </div>
              </div>

              <div className='grid-swap user'>
                {colony.materials.map((material: Material) => {
                  const value = subjectValue.tempSwapMaterials.user[material.materialId as keyof swapMaterials];
                  const iconMaterial = MATERIAL_LIST.find((mat) => mat.id === material.materialId)!;
                  return (
                    <div key={material.materialId} className='material-box'>
                      <div className={`material type-${material.materialId}`}>
                        <img src={iconMaterial.src} alt={iconMaterial.alt} />
                      </div>
                      <div className='range-box'>
                        <p>{maxDecimals(material.value! - value)}</p>
                        <RangeSlider
                          tooltip='off'
                          value={value}
                          max={Number(material.value)}
                          min={0}
                          step={0.05}
                          onChange={(e) =>
                            bloc.changeSwapMaterials(
                              material.materialId,
                              Number(e.target.value),
                              Number(material.value),
                              colony.materials,
                              'user'
                            )
                          }
                        />
                        <Input
                          className='input-text'
                          type='number'
                          min={0}
                          step={0.05}
                          max={Number(material.value)}
                          value={value}
                          onChange={(e) =>
                            bloc.changeSwapMaterials(
                              material.materialId,
                              Number(e.target.value),
                              Number(material.value),
                              colony.materials,
                              'user'
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={`materials-total-value ${bloc.checkSum(subjectValue.tempSwapMaterials, 'seller')}`}>
              <p className={`title total`}>
                {maxDecimals(subjectValue.tempSwapMaterials.user.total)}
              </p>
            </div>
          </div>
          <div className='seller-materials'>
            <div className='swap-box'>
              <div className='title seller'>
                <div className='title-text'>
                  <FormattedMessage id={`seller.sellerMaterials`} />
                </div>
                <div className='title-icon'>
                  <img
                    className={`button-undo ${subjectValue.tempSwapMaterials.seller.total === 0 ? 'disabled' : ''}`}
                    src='/images/finals/seller/refresh_btn.png'
                    alt='available materials'
                    onClick={() => bloc.resetSwap('seller')}
                  />
                </div>
              </div>

              {/* Seller Materials Section */}
              <div className='grid-swap seller'>
                {colony.materials.map((material: Material) => {
                  const iconMaterial = MATERIAL_LIST.find((mat) => mat.id === material.materialId)!;
                  const available = sellerData.materials.idMaterial.includes(material.materialId);
                  const pool = sellerData.pool_materials[material.materialId as keyof swapMaterials];
                  const val = subjectValue.tempSwapMaterials.seller[material.materialId as keyof swapMaterials];

                  return (
                    <div key={material.materialId} className={`material-box ${!available ? 'unavailable' : ''}`}>
                      <div className="material">
                        <img src={iconMaterial.src} alt={iconMaterial.alt} />
                      </div>
                      <div className="range-box">
                        <p>{maxDecimals(pool - val)}</p>
                        <RangeSlider
                          disabled={!available}
                          tooltip='off'
                          value={val}
                          max={pool}
                          min={0}
                          step={0.05}
                          onChange={(e) =>
                            bloc.changeSwapMaterials(
                              material.materialId,
                              Number(e.target.value),
                              pool,
                              colony.materials,
                              'seller',
                              sellerData.materials.discount
                            )
                          }
                        />
                        <Input
                          className='input-text'
                          disabled={!available}
                          type='number'
                          min={0}
                          step={0.05}
                          max={pool}
                          value={val}
                          onChange={(e) =>
                            bloc.changeSwapMaterials(
                              material.materialId,
                              Number(e.target.value),
                              pool,
                              colony.materials,
                              'seller',
                              sellerData.materials.discount
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={`materials-total-value ${bloc.checkSum(subjectValue.tempSwapMaterials, 'seller')}`}>
              <p className={`title total`}>
                {maxDecimals(subjectValue.tempSwapMaterials.seller.total)}
              </p>
            </div>
          </div>
          <div className='container-button'>
            <div className={`btn-box ${bloc.checkBtnSwapDisabled(subjectValue.tempSwapMaterials) ? 'disabled' : ''}`}>
             <Button
              className='swapBtn'
              disabled={bloc.checkBtnSwapDisabled(subjectValue.tempSwapMaterials)}
              onClick={async () => await bloc.swapMaterials(colony, subjectValue.tempSwapMaterials)}
            >
              <FormattedMessage id={`seller.dialog.swap.accept`} />
            </Button>             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerModalView;
