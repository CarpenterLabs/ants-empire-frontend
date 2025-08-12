import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'reactstrap';
import AntBloc from '../bloc/AntBloc';
import Style from '../styles/mintControls.module.scss';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { useOutletContext } from 'react-router-dom';

export const MintControls = (props: { fireMintFn: AntBloc['createAnts'] }) => {
  const outletContext: OutletContextType = useOutletContext<OutletContextType>();
  const [numberAnts, setNumberAnts] = useState<number>(0);
  return (
    <div className={Style.mintControls}>
      <input onChange={(e) => setNumberAnts(Number(e.target.value))} type='number' min={1} max={100}></input>
      <Button
        color='primary'
        disabled={numberAnts > 0 ? false : true}
        className={`disabled-${numberAnts > 0 ? false : true}`}
        onClick={async () => await props.fireMintFn(outletContext.socketIOService, numberAnts)}
      >
        <FormattedMessage id='antmint.mint' /> 📦
      </Button>
    </div>
  );
};
