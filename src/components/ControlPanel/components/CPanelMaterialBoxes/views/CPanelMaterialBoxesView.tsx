import { useEffect } from 'react';
import { Button } from 'reactstrap';
import Style from '../styles/CPanelMaterialBoxesView.module.scss';
import { FormattedMessage } from 'react-intl';
import { differenceObj, isEqual } from '@ComponentsRoot/core/CryptoAntsUtils';
import { CPanelMaterialBoxesViewProps } from '../types/CPanelMaterialBoxesSubject';
import EditMaterialBoxToBuy from '@ComponentsRoot/MaterialBox/views/EditMaterialBoxToBuy';
import { MaterialBoxToBuy } from '@ComponentsRoot/MaterialBox/types/MaterialBoxToBuy';
// import { EditMaterialBoxToBuyFormValueTypes } from '@ComponentsRoot/MaterialBox/types/EditMaterialBoxToBuyFormValueTypes';
// import EditMaterialBoxToBuy from '@ComponentsRoot/MaterialBox/views/EditMaterialBoxToBuy';

const CPanelMaterialBoxesView = (props: CPanelMaterialBoxesViewProps) => {
  useEffect(() => {
    if (!props.subjectValue.materialBoxes && !props.subjectValue.initialData) {
      props.bloc.setMaterialBoxesTempData(props.materialBoxesTempTabData ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      if (props.materialBoxesTempTabData && props.subjectValue.initialData) {
        const diff: object = differenceObj(props.materialBoxesTempTabData, props.subjectValue.initialData);
        if (
          props.materialBoxesTempTabData === undefined ||
          !isEqual(props.materialBoxesTempTabData, []) ||
          !Object.keys(diff).length
        ) {
          props.bloc.resetViewElementsToOriginalState(props.materialBoxesTempTabData);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.materialBoxesTempTabData]);

  const renderEditableMaterialBoxes = () => {
    return props.subjectValue.materialBoxes!.map((mBoxToBuy, key) => (
      <EditMaterialBoxToBuy
        diff={props.bloc.checkDifference(mBoxToBuy)}
        key={key.toString() + '_' + (mBoxToBuy._id ?? mBoxToBuy.createdMBox_id)}
        materialBox={mBoxToBuy as MaterialBoxToBuy & { isCurrentlyEditingMaterialBox: boolean }}
        handleChangeMaterialBox={props.bloc.handleChangeMaterialBox}
        handleRemoveMaterialBox={props.bloc.handleRemoveMBoxToBuy}
        handleAddMaterialBox={props.bloc.addNewMaterialBox}
        setEditable={props.bloc.setEditableMaterialBoxCard}
        wantReset={props.subjectValue.wantReset}
        setFalseWantToResetFn={props.bloc.setWantResetToFalse}
      />
    ));
  };

  const checkReloadBtn = () => {
    return '';
  };

  return (
    <div className={Style.CPanelMaterialBoxesView}>
      <h5>Material Boxes</h5>
      <div className='materialBoxes-region'>
        <Button
          color='primary'
          className={`create-btn`}
          // onClick={async () => props.bloc.addNewMaterialBox()}>
          onClick={() => props.bloc.addNewMaterialBox()}
        >
          <FormattedMessage id='cpanel.materialBox.addNewMaterialBox' />
        </Button>

        <Button
          color='primary'
          className={`save-btn disabled-${props.subjectValue.saveBtnDisabled}`}
          disabled={props.subjectValue.saveBtnDisabled}
          onClick={async () => await props.bloc.saveAllMaterialBoxesConfig(props.subjectValue.materialBoxes)}
        >
          <FormattedMessage id='cpanel.save' />
        </Button>

        {/* <img className={`button-undo ${checkReloadBtn()}`} */}
        <img
          className={`button-undo ${checkReloadBtn()}`}
          onClick={() => props.bloc.resetViewElementsToOriginalState(props.materialBoxesTempTabData)}
          src={`/images/reset.png`}
          alt='reset'
        />
      </div>

      <div className='gridMaterialBoxes'>{props.subjectValue.materialBoxes && renderEditableMaterialBoxes()}</div>
    </div>
  );
};

export default CPanelMaterialBoxesView;
