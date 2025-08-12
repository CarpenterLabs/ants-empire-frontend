import { FarmingQuestHistory } from '@ComponentsRoot/core/types/FarmingQuest/FarmingQuestHistory';
import { useState } from 'react';
import { Button } from 'reactstrap';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { useOutletContext } from 'react-router-dom';
export default function QuestActionButtons(props: {
  npcId: number;
  quest: FarmingQuestHistory;
  deliveryClickHandler: (questId: string, npcId: number, outletContext: OutletContextType) => Promise<void>;
  skipClickHandler: (questId: string, npcId: number) => Promise<void>;
}) {
  const outletContext: OutletContextType = useOutletContext<OutletContextType>();
  const [confirmingDelivery, setConfirmingDelivery] = useState(false);
  const [confirmingSkip, setConfirmingSkip] = useState(false);

  const handleSkipBtnClick = async (quest: FarmingQuestHistory) => {
    if (confirmingSkip) {
      // Perform your action here after confirmation
      await props.skipClickHandler(quest._id.toString(), props.npcId);
      setConfirmingSkip(false); // Reset confirming state
    } else {
      setConfirmingSkip(true);
      setConfirmingDelivery(false);
    }
  };

  const handleDeliveryBtnClick = async (quest: FarmingQuestHistory, outletContext: OutletContextType) => {
    if (confirmingDelivery) {
      // Perform your action here after SKIP confirmation
      await props.deliveryClickHandler(quest._id.toString(), props.npcId, outletContext);
      setConfirmingDelivery(false); // Reset confirming state
    } else {
      setConfirmingDelivery(true);
      setConfirmingSkip(false);
    }
  };

  return (
    <>
      {props.quest.successedDate ? (
        <>
          <div className='success'>
            <img src='/images/finals/tavern/checkmark.png' alt='completed' />
          </div>
        </>
      ) : (
        <div className={`executeAndSkipBtns`}>
          <div className='executeQuestBtn'>
            <Button
              disabled={!props.quest.playerMeetQuestCost}
              onClick={async () => await handleDeliveryBtnClick(props.quest, outletContext)}
              className={'deliveryBtn'}
            >
              {confirmingDelivery ? 'Sure?' : 'DELIVERY'}
            </Button>
          </div>
          <div className='skipQuestBtn'>
            <Button onClick={async () => await handleSkipBtnClick(props.quest)} className='skipBtn'>
              {confirmingSkip ? 'SURE?' : 'SKIP'}
              {/* <i className='fa fa-solid fa-forward'></i> */}
              <img style={{width: '15px', marginLeft: '5px'}} src='/images/finals/tavern/skip_icon.png' alt='skipIcon'/>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
