import { Button, Card, CardBody, CardImg, Col, Input } from "reactstrap";
import Style from '../styles/editPackCard.module.scss';
import { antGuaranteed, PackToBuy } from "@ControlPanelComponents/CPanelStandard/types/Cache";
import { EditWelcomePackCardState } from "../types/WelcomePackSubject";
import { get100 } from "../bloc/WelcomePackBloc";
import { FormattedMessage } from "react-intl";

const EditWelcomePackCard = (props: Pick<EditWelcomePackCardState,
  'pack' |
  'handleChangePack' |
  'setEditable' |
  'handleChangeRemove' |
  'addNewPack' |
  'families' |
  'addNewGuaranteedAnt' |
  'setEditableAntProb' |
  'handleChangeAntProb' |
  'handleRemoveGuaranteed' |
  'checkErrorAntProb' |
  'setBoxStatus' |
  'checkErrorField' |
  'diff' |
  'formatMessage'>) => {

  const numGuaranteed: number = props.pack.ant_guaranteed && props.pack.ant_guaranteed.length ? props.pack.ant_guaranteed.length : 0;
  const { action, edited, ...diff } = props.diff;

  const renderRarity = (rarity: PackToBuy["ant_rarity"], antType: "default" | "guaranteed", keyGuaranteed?: number) => {
    return rarity.map((item: [string, number], key: number) => (
      props.pack.edited &&
        ((props.pack.edited.keyGuaranteed === undefined) || (props.pack.edited.keyGuaranteed === keyGuaranteed)) &&
        props.pack.edited.status &&
        props.pack.edited.key === key &&
        props.pack.edited.type === "rarity" &&
        props.pack.edited.antType === antType ?
        <div key={key} className={`power ${`rarity-${item[0]}`}`}>
          <input
            key={key}
            type="number"
            min="0"
            max="100"
            value={item[1]}
            onChange={(e) => props.handleChangeAntProb(props.pack, [item[0], Number(e.target.value)], "rarity", key, antType, keyGuaranteed)}
            autoFocus />
        </div>
        :

        <div key={key} className={`power ${`rarity-${item[0]}`} ${props.checkErrorAntProb(diff, "ant_rarity") && "error"}`} onClick={() => props.setEditableAntProb(props.pack, "rarity", key, antType, keyGuaranteed)}>
          {item[1]}%
        </div >
    ))
  }

  const renderType = (type: PackToBuy["ant_type"], antType: "default" | "guaranteed", keyGuaranteed?: number) => {
    return type.map((item: [string, number], key: number) => (
      props.pack.edited &&
        ((props.pack.edited.keyGuaranteed === undefined) || (props.pack.edited.keyGuaranteed === keyGuaranteed)) &&
        props.pack.edited.status &&
        props.pack.edited.key === key &&
        props.pack.edited.type === "type" &&
        props.pack.edited.antType === antType ?
        <div key={key} className={`${`type ${item[0]}`}`}>
          <input
            key={key}
            type="number"
            min="0"
            max="100"
            value={item[1]}
            onChange={(e) => props.handleChangeAntProb(props.pack, [item[0], Number(e.target.value)], "type", key, antType, keyGuaranteed)}
            autoFocus />
        </div>
        :

        <div key={key} className={`${`type ${item[0]}`} ${props.checkErrorAntProb(diff, "ant_type") && "error"}`} onClick={() => props.setEditableAntProb(props.pack, "type", key, antType, keyGuaranteed)}>
          {item[1]}% <img className={``} src={`/images/${item[0]}.png`} alt={item[0]} />
        </div>
    ))
  }

  const renderGuaranteed = (guaranteed: PackToBuy["ant_guaranteed"]) => {
    return guaranteed!.map((item: antGuaranteed, keyGuaranteed: number) => (
      <div key={keyGuaranteed} className={`general-box guaranteed ${props.checkErrorAntProb(diff, "ant_guaranteed", keyGuaranteed) && "error"}`}>
        <Col xs={3} className="general-content">
          <div className="default-box">
            <div className="inside">
              <span>{item.number ? item.number : 1}</span>
              <img className="ant" src={`/images/mini-ant.png`} alt={`ant`} />
              {get100(item.ant_type) ?
                <img
                  className={`a-type ${get100(item.ant_type)}`}
                  src={`/images/${get100(item.ant_type)}.png`}
                  alt={`ant_${get100(item.ant_type)}`} />
                : ""}
            </div>
          </div>
        </Col>
        <Col xs={8} className="general-content bl">
          <div className='box-type bb'>
            {renderRarity(item.ant_rarity, "guaranteed", keyGuaranteed)}
          </div>
          <div className='box-type'>
            {renderType(item.ant_type, "guaranteed", keyGuaranteed)}
          </div>
        </Col>
        <Col xs={1} className="general-content removeAnt" onClick={() => props.handleRemoveGuaranteed(props.pack, keyGuaranteed)}>
          <div className="btn-rm">
            <img src={`/images/trash.png`} alt="remove" />
          </div>
        </Col>
      </div>
    ))
  }

  const renderDefault = (ant_rarity: PackToBuy["ant_rarity"], ant_type: PackToBuy["ant_type"], num_mints: PackToBuy["num_mints"], numGuaranteed: number) => {
    return <div className={`general-box ${diff.errors && (diff.errors.ant_rarity || diff.errors.ant_type) && "error"}`}>
      <Col xs={3} className="general-content">
        <div className="default-box">
          <div className="inside">
            <span>{num_mints - numGuaranteed}</span>
            <img className="ant" src={`/images/mini-ant.png`} alt="ant" />
          </div>
        </div>
      </Col>
      <Col xs={9} className="general-content bl">
        <div className='box-type bb'>
          {renderRarity(ant_rarity, "default")}
        </div>
        <div className='box-type'>
          {renderType(ant_type, "default")}
        </div>
      </Col>
    </div>
  }

  const editableInput = (fieldName: keyof PackToBuy, inputType: string = "text") => {
    return props.pack.edited === fieldName ?
      <p className={`title-editable-input ${fieldName}`}>
        <input
          type={inputType}
          value={props.pack[fieldName as keyof PackToBuy] as keyof PackToBuy}
          min="0"
          max="100"
          onChange={(e) => props.handleChangePack(fieldName, inputType === "number" ? Number(e.target.value) : e.target.value, props.pack)}
          autoFocus />
      </p> :
      <p className={`title-editable-input ${fieldName}`} onClick={() => props.setEditable(props.pack, fieldName)}>
        {props.pack[fieldName as keyof PackToBuy]}
      </p>
  }



  return (
    <div className={Style.editWelcomePackCard}>
      <div className={`packCard-content ${props.pack.isTemporaryPack && `newpack`}`}>
        {Object.keys(diff).length > 0 &&
          <img className="minibtn update" src={`/images/edit.png`} alt="edit" />
        }

        {/* <img className="minibtn cloud" src={`/images/${props.pack.isTemporaryPack ? `new` : `save_cloud`}.png`} alt="Save in mongodb" /> */}
        <img className="minibtn duplicate" onClick={() => props.addNewPack(props.pack)} src={`/images/duplicate.png`} alt="duplicate" />

        {props.pack.action === "remove" ?
          <img className="minibtn undo" onClick={() => props.handleChangeRemove(props.pack, "undo")} src={`/images/reset.png`} alt="close" /> :
          <img className="minibtn close" onClick={() => props.handleChangeRemove(props.pack, "remove")} src={`/images/close.svg`} alt="undo" />
        }
        <Card className={` ${props.pack.action === "remove" && `unavailable`}`}>

          <div className={`mystery-img-box ${props.setBoxStatus(diff)} `}>
            <CardImg variant='top' src={`/images/${props.pack.family}.png`} />
          </div>

          {props.pack.isTemporaryPack ? <p className="warningtext ko"> <FormattedMessage id="editpack.isTemporaryPack" /> </p> :
            <p className="warningtext ok">
              <FormattedMessage id="editpack.packSaved" />
            </p>}

          <div className="card-header">
            <p className="title-field">
              <FormattedMessage id="editpack.title" />
            </p>
            {editableInput("title")}
          </div>

          <div className="card-header">
            <p className="title-field">
              <FormattedMessage id="editpack.price" />
            </p>
            {editableInput("price", "number")}
          </div>

          <div className={`card-header ${!props.pack.createdPack_id && "disabled"}`}>
            <p className="title-field">
              <FormattedMessage id="editpack.family" />
            </p>
            {props.pack.edited === "family" ?
              <Input className="family-select"
                type="select"
                autoFocus
                value={props.pack.family}
                onChange={(e) => props.handleChangePack("family", e.target.value, props.pack)} >
                {props.families.map((family: string, key: number) =>
                  <option key={key} value={String(family)}> {family} </option>)}
              </Input>
              :
              <p className="title-editable-input family" onClick={() => props.pack.createdPack_id && props.setEditable(props.pack, "family")}>
                {props.pack.family}
              </p>
            }
          </div>

          <div className={`card-header ${props.checkErrorField(diff, "packToBuyId")} ${!props.pack.createdPack_id && "disabled"}`}>
            <p className="title-field">
              <FormattedMessage id="editpack.packtobuyid" />
            </p>
            {props.pack.createdPack_id ? editableInput("packToBuyId") : props.pack.packToBuyId}
          </div>

          <div className="card-header">
            <p className="title-field">
              <FormattedMessage id="editpack.maxbuy" />
            </p>
            {editableInput("max_buy_qty", "number")}
          </div>

          <div className="card-header">
            <p className="title-field">
              <FormattedMessage id="editpack.nummints" />
            </p>
            {editableInput("num_mints", "number")}
          </div>

          <div className="card-header">
            <p className="title-field">
              <FormattedMessage id="editpack.published" />
            </p>
            <input type="checkbox"
              className="published-check"
              checked={props.pack.published}
              onChange={(e) => props.handleChangePack("published", e.target.checked, props.pack)} />
          </div>

          <div className={`card-header ${props.checkErrorField(diff, "weight")}`}>
            <p className="title-field">
              <FormattedMessage id="editpack.weight" />

            </p>
            {editableInput("weight", "number")}
          </div>

          <div className="card-header description">
            <p className="title-field">
              <FormattedMessage id="editpack.description" />

            </p>
            {props.pack.edited === "description" ?
              <textarea
                className="description-textarea"
                value={props.pack.description}
                onChange={(e) => props.handleChangePack("description", e.target.value, props.pack)}
                autoFocus />
              :
              <p className="title-editable-input description" onClick={() => props.setEditable(props.pack, "description")}>
                {props.pack.description}
              </p>
            }
          </div>

          <p className="title-field regular-ants">
            <FormattedMessage id="editpack.regularants" />

          </p>
          {renderDefault(props.pack.ant_rarity, props.pack.ant_type, props.pack.num_mints, numGuaranteed)}
          <>
            <div className="headGuaranteed">
              <p className="title-field">
                <FormattedMessage id="editpack.guaranteedants" />

              </p>
              <div className="btns">
                {numGuaranteed > 1 &&
                  <Button
                    size="sm"
                    className={`remove-all-guaranteed`}
                    onClick={async () => props.handleRemoveGuaranteed(props.pack, "all")}>
                    <FormattedMessage id="editpack.removeAll" />
                  </Button>
                }
                {numGuaranteed < props.pack.num_mints &&
                  <Button
                    color="primary"
                    size="sm"
                    className={`create-btn`}
                    onClick={async () => props.addNewGuaranteedAnt(props.pack)}>
                    <FormattedMessage id="editpack.addAnt" />
                  </Button>
                }

              </div>
            </div>
            {props.pack.ant_guaranteed && renderGuaranteed(props.pack.ant_guaranteed)}
          </>

          <CardBody>
            <div className='button-box'>
              {props.pack.max_buy_qty ?
                <p className="purchased-times">
                  {props.formatMessage(
                    {
                      id: "editpack.onlypurchased",
                    },
                    { maxbuy: props.pack.max_buy_qty }
                  )}
                </p>
                : null}
            </div>
          </CardBody>

        </Card>
      </div >
    </div >
  )
};

export default EditWelcomePackCard;