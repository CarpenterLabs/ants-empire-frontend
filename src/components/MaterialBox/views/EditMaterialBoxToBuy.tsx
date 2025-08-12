import { MaterialBoxToBuy, materialEmojisRelation } from '@ComponentsRoot/MaterialBox/types/MaterialBoxToBuy';
import Style from '../styles/EditMaterialBoxToBuy.module.scss';
import { FormattedMessage } from 'react-intl';
import { useForm } from 'react-hook-form';
import { EditMaterialBoxToBuyFormValueTypes } from '../types/EditMaterialBoxToBuyFormValueTypes';
import CPanelMaterialBoxesBloc from '@ComponentsRoot/ControlPanel/components/CPanelMaterialBoxes/bloc/CPanelMaterialBoxesBloc';
import { useEffect } from 'react';

type EditMaterialBoxToBuyPropsType = {
  materialBox: MaterialBoxToBuy & { isCurrentlyEditingMaterialBox: boolean };
  diff: any;
  handleChangeMaterialBox: CPanelMaterialBoxesBloc['handleChangeMaterialBox'];
  handleRemoveMaterialBox: CPanelMaterialBoxesBloc['handleRemoveMBoxToBuy'];
  handleAddMaterialBox: CPanelMaterialBoxesBloc['addNewMaterialBox'];
  setEditable: CPanelMaterialBoxesBloc['setEditableMaterialBoxCard'];
  wantReset: boolean;
  setFalseWantToResetFn: CPanelMaterialBoxesBloc['setWantResetToFalse'];
};

const getDefaultValues = (props: EditMaterialBoxToBuyPropsType) => {
  return {
    ...props.materialBox,
    material1: props.materialBox.materials[0][1],
    material2: props.materialBox.materials[1][1],
    material3: props.materialBox.materials[2][1],
    material4: props.materialBox.materials[3][1],
    material5: props.materialBox.materials[4][1],
  };
};

const EditMaterialBoxToBuy = (props: EditMaterialBoxToBuyPropsType) => {
  const { action, ...diff } = props.diff;

  const {
    register,
    reset,
    formState: { errors },
  } = useForm<EditMaterialBoxToBuyFormValueTypes>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: getDefaultValues(props),
  });

  useEffect(() => {
    if (props.wantReset) {
      reset(getDefaultValues(props));
      // have to be setted from here calling setValue, because its a boolean
      props.setFalseWantToResetFn();
      // props.bloc.setMaterialBoxesTempData(props.materialBoxesTempTabData ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.wantReset]);

  // const
  const getIfInputIsDisabled = () => {
    return !props.materialBox.isCurrentlyEditingMaterialBox;
  };

  const getErrMsgOnInput = (key: keyof EditMaterialBoxToBuyFormValueTypes) => {
    return errors?.[key] ? errors[key]?.message : '';
  };

  const handleClickEditMaterialBoxCard = () => {
    props.setEditable(props.materialBox as EditMaterialBoxToBuyFormValueTypes, true);
  };

  const oldCardBody = () => {
    return (
      <div
        className={`wsk-cp-product ${props.materialBox.isCurrentlyEditingMaterialBox ? 'currentlyEditingCard' : ''} ${
          props.materialBox.action === 'remove' ? `unavailable` : ''
        }`}
        onClick={(e) => handleClickEditMaterialBoxCard()}
      >
        <img
          className='minibtn duplicate'
          onClick={(e) => {
            e.preventDefault();
            props.handleAddMaterialBox(props.materialBox);
          }}
          src={`/images/duplicate.png`}
          alt='duplicate'
        />

        {Object.keys(diff).length > 0 && <img className='animated fadeIn minibtn update' src={`/images/edit.png`} alt='edit' />}

        {props.materialBox.action === 'remove' ? (
          <img
            className='minibtn undo'
            onClick={() => props.handleRemoveMaterialBox(props.materialBox, 'undo')}
            src={`/images/reset.png`}
            alt='undo'
          />
        ) : (
          <img
            className='minibtn close'
            onClick={() => props.handleRemoveMaterialBox(props.materialBox, 'remove')}
            src={`/images/close.svg`}
            alt='remove'
          />
        )}

        {/* <Card className={` ${packToBuy.action === "remove" && `unavailable`}`}> */}

        <div className='wsk-cp-img'>
          <img src='/images/MaterialBoxFinalNoBg.png' alt='Product' />
        </div>

        <div className='wsk-cp-text'>
          {props.materialBox.isTemporary ? (
            <p className='warningtext ko'>
              <FormattedMessage id='materialBox.isTemporary' />
            </p>
          ) : (
            <p className='warningtext ok'>
              <FormattedMessage id='materialBox.mBoxSaved' />
            </p>
          )}

          <div className='materialsInsideBox'>
            {props.materialBox.materials.map(([materialId, materialQtty], key) => {
              const materialKeyName = `material${materialId.toString()}` as keyof EditMaterialBoxToBuyFormValueTypes;
              return (
                <div className='text-center' key={key.toString()}>
                  <span>{materialEmojisRelation[materialId]}</span>
                  <input
                    className={`mBoxQttyInput ${errors[materialKeyName] ? 'input-errored' : ''}`}
                    readOnly={getIfInputIsDisabled()}
                    disabled={getIfInputIsDisabled()}
                    type={'number'}
                    defaultValue={materialQtty}
                    {...register(materialKeyName, {
                      valueAsNumber: true,
                      required: true,
                      min: 0,
                      onChange: (e) =>
                        props.handleChangeMaterialBox(
                          e.target.value,
                          materialKeyName,
                          props.materialBox as EditMaterialBoxToBuyFormValueTypes
                        ),
                    })}
                  />

                  {/* <span>{materialQtty}</span> */}
                </div>
              );
            })}
          </div>

          <div className='title-product'>
            <p className='title-field'>
              <FormattedMessage id='materialBox.mBoxToBuyId' />
            </p>
            <input
              className={`${errors?.mBoxToBuyId ? 'input-errored' : ''}`}
              readOnly={getIfInputIsDisabled()}
              disabled={getIfInputIsDisabled()}
              type={'string'}
              defaultValue={props.materialBox.mBoxToBuyId}
              {...register('mBoxToBuyId', {
                required: true,
                onChange: (e) =>
                  props.handleChangeMaterialBox(
                    e.target.value,
                    'mBoxToBuyId',
                    props.materialBox as EditMaterialBoxToBuyFormValueTypes
                  ),
              })}
            />
            <>{getErrMsgOnInput('mBoxToBuyId')}</>
          </div>

          <div className='title-product'>
            <p className='title-field'>
              <FormattedMessage id='materialBox.name' />
            </p>
            <input
              className={`${errors?.name ? 'input-errored' : ''}`}
              readOnly={getIfInputIsDisabled()}
              disabled={getIfInputIsDisabled()}
              type={'string'}
              defaultValue={props.materialBox.name}
              {...register('name', {
                required: true,
                onChange: (e) =>
                  props.handleChangeMaterialBox(e.target.value, 'name', props.materialBox as EditMaterialBoxToBuyFormValueTypes),
              })}
            />
            <>{getErrMsgOnInput('name')}</>
          </div>
          <div className='description'>
            <p className='title-field'>
              <FormattedMessage id='materialBox.descripcion' />
            </p>
            <input
              className={`${errors?.description ? 'input-errored' : ''}`}
              readOnly={getIfInputIsDisabled()}
              disabled={getIfInputIsDisabled()}
              type={'string'}
              defaultValue={props.materialBox.description}
              {...register('description', {
                required: true,
                onChange: (e) =>
                  props.handleChangeMaterialBox(
                    e.target.value,
                    'description',
                    props.materialBox as EditMaterialBoxToBuyFormValueTypes
                  ),
              })}
            />
            <> {getErrMsgOnInput('description')}</>
          </div>

          <div className='title-product'>
            <p className='title-field'>
              <FormattedMessage id='materialBox.published' />
            </p>
            <input
              readOnly={getIfInputIsDisabled()}
              disabled={getIfInputIsDisabled()}
              type={'checkbox'}
              // defaultChecked={props.materialBox.published}
              className='form-check-input'
              {...register('published', {
                required: true,
                onChange: (e) =>
                  props.handleChangeMaterialBox(
                    e.target.checked,
                    'published',
                    props.materialBox as EditMaterialBoxToBuyFormValueTypes
                  ),
              })}
            />
            <>{getErrMsgOnInput('published')}</>
          </div>

          <div className='card-footer'>
            <div className='price'>
              <p className='title-field'>
                <FormattedMessage id='materialBox.price' />
              </p>
              <input
                className={`${errors?.price ? 'input-errored' : ''}`}
                readOnly={getIfInputIsDisabled()}
                disabled={getIfInputIsDisabled()}
                type={'number'}
                defaultValue={props.materialBox.price}
                {...register('price', {
                  valueAsNumber: true,
                  required: true,
                  onChange: (e) =>
                    props.handleChangeMaterialBox(
                      e.target.value,
                      'price',
                      props.materialBox as EditMaterialBoxToBuyFormValueTypes
                    ),
                })}
              />
              <>{getErrMsgOnInput('price')}</>
              {/* <img alt='Nectar Logo' style={{ width: '25px' }} src={`/images/nectar.png`} /> {props.materialBox.price} */}
              {/* <span className="price">Nectar: {props.materialBox.price}</span> */}
            </div>
            {/* <div className='wcf-right'>
      <div
        onClick={
          props.isToastrVisible ? () => {} : async () => await props.purchaseMaterialBoxFn(props.materialBox.mBoxToBuyId)
        }
        className='buy-btn'
        style={{ cursor: 'pointer' }}
      >
        <i className='fa fa-shopping-cart' style={{ fontSize: '20px' }} aria-hidden='true'></i>
      </div>
    </div> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={Style.shopCardItem}>
      {oldCardBody()}
      {/* {getAllFormInputs()} */}
    </div>
  );
};

export default EditMaterialBoxToBuy;
