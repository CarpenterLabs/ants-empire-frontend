export type AddToColonyBodyType = {
  colonyId: string;
  itemsToAdd: Array<{ type: 'mbox' | 'ant'; idsToAdd: string[] }>;
};
