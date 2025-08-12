import { PackToBuy } from '@ComponentsRoot/ControlPanel/components/CPanelStandard/types/Cache';
import { PowerTicket } from './PowerTicket';

export type ExpeditionReward = {
  _id?: string;
  destinationId: number;
  winCount: number;
  type: 'MINT' | 'POWERTICKET';
  matchedItem: string | PackToBuy | PowerTicket; // ObjectId of corresponding item
  available?: boolean; //calculated dynamically on mapping when returning all the expeditionRewards
  price: number; // added only in mint cases, in powerTickets case, the field has value by default
  purchased?: boolean; //calculated dynamically on mapping when returning all the expeditionRewards
};
