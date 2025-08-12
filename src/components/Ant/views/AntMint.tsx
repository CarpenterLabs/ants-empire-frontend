import { MouseEventHandler, ChangeEventHandler } from "react";
import { FormattedMessage } from "react-intl";

const AntMint = (props: {changeNumber: ChangeEventHandler<HTMLInputElement>, disabled: boolean, createAnts: MouseEventHandler<HTMLButtonElement>}): any => {
    return <>
      <FormattedMessage id="antmint.addAnt" />
      <br></br>
      <input onChange={props.changeNumber} type="number" min="1" max="100"></input>
      <button disabled={props.disabled} onClick={props.createAnts}><FormattedMessage id="antmint.mint"/></button>
      </>
}

export default AntMint;