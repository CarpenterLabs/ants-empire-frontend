import React from 'react';
import MiniExpeditionCard from './MiniExpeditionCard';
import { Destination } from '../types/Expeditions';
import ExpeditionBloc from '../bloc/ExpeditionBloc';
import { ExpeditionReward } from '../types/ExpeditionReward';

const TimeLineView = (props: {
  destinations: Destination[];
  toggleDetailDestinationModal: ExpeditionBloc['toggleDetailDestinationModal'];
  toggleExpeRewardsModal: ExpeditionBloc['toggleExpeditionRewards'];
  isAbleToStartExpedition: boolean;
  expeRewards: ExpeditionReward[];
}) => {
  const renderTimeLine = () => {
    const timelineElements: JSX.Element[] = [];
    for (let i = 0; i < props.destinations.length; i += 2) {
      timelineElements.push(
        <React.Fragment key={i}>
          <div className='timeline-middle'>
            <div className='timeline-circle'>{i + 1}</div>
          </div>
          <MiniExpeditionCard
            destination={props.destinations[i]}
            left={false}
            toggleDetailDestinationModal={props.toggleDetailDestinationModal}
            isAbleToStartExpedition={props.isAbleToStartExpedition}
            toggleExpeRewardsModal={props.toggleExpeRewardsModal}
            hasRewards={!!props.expeRewards?.find((reward) => reward.destinationId === props.destinations[i].destinationId)}
          />
          {i + 1 < props.destinations.length && (
            <React.Fragment>
              <MiniExpeditionCard
                toggleExpeRewardsModal={props.toggleExpeRewardsModal}
                destination={props.destinations[i + 1]}
                left={true}
                toggleDetailDestinationModal={props.toggleDetailDestinationModal}
                isAbleToStartExpedition={props.isAbleToStartExpedition}
                hasRewards={
                  !!props.expeRewards?.find((reward) => reward.destinationId === props.destinations[i + 1].destinationId)
                }
              />
              <div className={`timeline-middle ${i + 2 === 10 && 'last'}`}>
                <div className='timeline-circle'>{i + 2}</div>
              </div>
              <div className='timeline-empty'></div>
              <div className='timeline-empty'></div>
            </React.Fragment>
          )}
        </React.Fragment>
      );
    }
    return timelineElements;
  };

  return (
    <div className='timeLine-styles'>
      <section className='design-section'>
        <div className='timeline'>
          <div className='timeline-empty'></div>
          {renderTimeLine()}
        </div>
      </section>
    </div>
  );
};

export default TimeLineView;
