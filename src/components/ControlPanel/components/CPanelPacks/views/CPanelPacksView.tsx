import { useEffect } from 'react';
import { Button, Input, Table } from 'reactstrap';
import { allPacksResponseType } from '../types/CPanelPacksSubject';
import Style from '../styles/cPanelPacksView.module.scss';
import { FormattedMessage } from "react-intl";
import EditWelcomePackCard from '@ComponentsRoot/WelcomePack/views/EditWelcomePackCard';
import { PackToBuy } from '../../CPanelStandard/types/Cache';
import { CPanelPacksViewProps } from '../../CPanelPacks/types/CPanelPacksSubject';
import { differenceObj, isEqual } from '@ComponentsRoot/core/CryptoAntsUtils';

const CPanelPacksView = (props: CPanelPacksViewProps) => {
  const initialData: allPacksResponseType = {
    packs: props.packsTempTabData.packs ? props.packsTempTabData.packs : [],
    families: props.packsTempTabData.families ? props.packsTempTabData.families : [],
    discount_wpack: props.packsTempTabData.discount_wpack ? props.packsTempTabData.discount_wpack : []
  };

  useEffect(() => {
    if (!props.subjectValue.packsTempTabData && !props.subjectValue.initialData) {
      props.bloc.setPackTempData(initialData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      if (props.packsTempTabData && props.subjectValue.initialData) {
        const diff: object = differenceObj(props.packsTempTabData, props.subjectValue.initialData);
        if (
          (props.packsTempTabData.packs === undefined) ||
          !isEqual(props.packsTempTabData.packs, []) ||
          !Object.keys(diff).length
        ) {
          props.bloc.resetViewElements(props.packsTempTabData);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.packsTempTabData]);

  const renderSelectionPacks = () => {
    const type = props.subjectValue.selectorFamily;
    return props.subjectValue.packsTempTabData!.packs.filter((pack: PackToBuy) =>
      type === "all" ? true : pack.family === type).map((pack: PackToBuy, key: number) =>
        <EditWelcomePackCard
          diff={props.bloc.checkDifference(pack)}
          key={key}
          pack={pack}
          handleChangePack={props.bloc.handleChangePack}
          setEditable={props.bloc.setEditable}
          handleChangeRemove={props.bloc.handleChangeRemove}
          addNewPack={props.bloc.addNewPack}
          addNewGuaranteedAnt={props.bloc.addNewGuaranteedAnt}
          setEditableAntProb={props.bloc.setEditableAntProb}
          handleChangeAntProb={props.bloc.handleChangeAntProb}
          handleRemoveGuaranteed={props.bloc.handleRemoveGuaranteed}
          checkErrorAntProb={props.bloc.checkErrorAntProb}
          setBoxStatus={props.bloc.setBoxStatus}
          checkErrorField={props.bloc.checkErrorField}
          families={props.subjectValue.packsTempTabData!.families}
          formatMessage={props.bloc.providerProps.cpanelBloc.providerProps.intl.formatMessage} />);
  }

  const checkReloadBtn = () => {
    const { packsTempTabData, initialData } = props.subjectValue;
    if (!packsTempTabData) return null;
    const { packs, discount_wpack } = packsTempTabData;
    return (!packs.find(pack => pack.action) && JSON.stringify(discount_wpack) === JSON.stringify(initialData?.discount_wpack))
      ? "disabled"
      : "enabled";
  }

  return (
    <div className={Style.cPanelPacksView}>
      <h5>Pack families:</h5>

      <div className="families-selectors">
        <Input className="families"
          type="select"
          value={props.subjectValue.selectorFamily}
          onChange={(e) => { props.bloc.changeSelectionFamily(e.target.value) }}>
          <option value={"all"}>
            {props.bloc.providerProps.cpanelBloc.providerProps.intl.formatMessage({ id: 'general.all' })}
          </option>
          {props.subjectValue.packsTempTabData?.families.map((family: string, key: number) =>
            <option key={key} value={String(family)}> {family} </option>)}
        </Input>

        <Button
          color="primary"
          className={`new-family-btn ${!props.subjectValue.newFamilyBtnDisabled && `disabled`}`}
          onClick={() => { props.bloc.ToggleBtnFamily(!props.subjectValue.newFamilyBtnDisabled) }} >
          <FormattedMessage id="cpanel.packs.addNewFamily" />
        </Button>

        {!props.subjectValue.newFamilyBtnDisabled &&
          <>
            <Input className="new-family"
              type="text"
              autoFocus
              value={props.subjectValue.newFamilyValue}
              onChange={(e) => { props.bloc.handleNewFamilyInput(e.target.value) }} />

            <Button
              color="primary"
              className={`save-family-btn ${props.subjectValue.newFamilyValue.length <= 0 && `disabled`}`}
              onClick={() => { props.bloc.saveNewFamily(props.subjectValue.newFamilyValue) }} >
              <FormattedMessage id="cpanel.save" />
            </Button>

            <img className="close-family-input"
              src={`/images/close.svg`}
              alt="close"
              onClick={() => { props.bloc.ToggleBtnFamily(!props.subjectValue.newFamilyBtnDisabled) }} />
          </>
        }
      </div>
      <br />

      <h5>Discounts:</h5>
      <div className='btns-discount'>
        <Button
          color="primary"
          className={`create-btn`}
          onClick={async () => props.bloc.handleChangeDiscount("add")}>
          <FormattedMessage id="cpanel.packs.addNewDiscount" />
        </Button>

        <Button
          color="danger"
          className={`create-btn`}
          onClick={async () => props.bloc.handleChangeDiscount("remove")}>
          <FormattedMessage id="cpanel.packs.removeLastDiscount" />
        </Button>
      </div>

      <Table className='table-discounts'>
        <thead>
          <tr>
            <th>
              <FormattedMessage id="cpanel.packs.purchasedPacks" />
            </th>
            {props.subjectValue.packsTempTabData?.discount_wpack.map((_, index) => (
              <th key={index}>{index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='nohover'>
              <FormattedMessage id="cpanel.packs.discount" />
            </td>
            {props.subjectValue.packsTempTabData?.discount_wpack.map((value, index) => (
              props.subjectValue.discountEditable === index ?
                <input
                  type="number"
                  value={value}
                  min="0"
                  onChange={(e) => props.bloc.handleChangeValueDiscount(Number(e.target.value), index)}
                  autoFocus />
                :
                <td key={index} onClick={async () => props.bloc.setEditableDiscount(index)}>{value}%</td>
            ))}
          </tr>
        </tbody>
      </Table>
      <br />

      <h5>Packs:</h5>
      <div className='pack-selectors'>
        <Button
          color="primary"
          className={`create-btn`}
          onClick={async () => props.bloc.addNewPack()}>
          <FormattedMessage id="cpanel.packs.addNewPack" />
        </Button>

        <Button
          color="primary"
          className={`save-btn disabled-${props.subjectValue.packsSaveBtnDisabled}`}
          disabled={props.subjectValue.packsSaveBtnDisabled}
          onClick={async () => await props.bloc.savePacksConfig(props.subjectValue.packsTempTabData)}>
          <FormattedMessage id="cpanel.save" />
        </Button>

        <img className={`button-undo ${checkReloadBtn()}`}
          onClick={() => props.bloc.resetViewElements(initialData)}
          src={`/images/reset.png`}
          alt="reset" />
      </div>

      <div className='gridPacks'>
        {props.subjectValue.packsTempTabData && renderSelectionPacks()}
      </div>
    </div>
  );
};

export default CPanelPacksView;
