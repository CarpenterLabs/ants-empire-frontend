import { Colony } from '@ComponentsRoot/Colonies/types/Colony';

export default function WorkShopRoom(props: { colony: Colony; onClickBlackSmithFn: () => void }) {
  return (
    <div className='workShopRoomContent'>
      <div className='blackSmithButton' onClick={props.onClickBlackSmithFn}>
        <img src={`/images/blackSmith512x512.png`} alt='blackSmith' />
      </div>
      {/* <div className='speech-wrapper'>
        <div className='bubble'>
          <div className='txt'>
            <p className='name'>{props.colony.blackSmith.name}</p>
            <p className='message'>{props.colony.blackSmith.description}</p>
            <span className='timestamp'>10:20 pm</span>
          </div>
          <div className='bubble-arrow'></div>
        </div>
      </div> */}
    </div>
  );
}
