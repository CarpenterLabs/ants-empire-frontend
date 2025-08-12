import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { IOption } from 'export-from-json/dist/types/exportFromJSON';
import exportFromJSON from 'export-from-json';
import _ from 'lodash';
import { ControlPanelSubject } from '@ControlPanelComponents/CPanelStandard/types/ControlPanelSubject';
import { DateTime } from 'luxon';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
export const isEqual = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const formatDate = (date: Date) => {
  return (
    [date.getDate().toString().padStart(2, '0'), (date.getMonth() + 1).toString().padStart(2, '0'), date.getFullYear()].join('') +
    '_' +
    [
      date.getHours().toString().padStart(2, '0'),
      date.getMinutes().toString().padStart(2, '0'),
      date.getSeconds().toString().padStart(2, '0'),
    ].join('')
  );
};

interface ExportFile {
  fields: Object;
  data: Ant[];
  fileName: string;
  exportType: string;
}

export const exportAnts = (antList: Ant[]): IOption<ExportFile> => {
  return {
    fields: {
      power: 'Power',
      rarity: 'Rarity',
      type: 'Type',
      specie: 'Specie',
    },
    data: antList as object,
    fileName: `ants_${formatDate(new Date())}`,
    exportType: exportFromJSON.types.xls,
  };
};

export const exportSimulation = (simulation: ControlPanelSubject['simulationTempTabData']): IOption<ExportFile> => {
  return {
    fields: {
      simulationId: 'SimulationID',
      mintId: 'MintID',
      power: 'Power',
      rarity: 'Rarity',
      type: 'Type',
      specie: 'Specie',
    },
    data: simulation as object,
    fileName: `simulation_${formatDate(new Date())}`,
    exportType: exportFromJSON.types.xls,
  };
};

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export function differenceObj(object: any, base: any): object {
  function changes(object: any, base: any) {
    return _.transform(object, function (result: any, value: any, key: any) {
      if (!_.isEqual(value, base[key])) {
        result[key] = _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
}

export const maxDecimals = (value: number | string) => {
  const valueStr = value.toString();
  const decimalIndex = valueStr.indexOf('.');
  if (decimalIndex !== -1) {
    return Number(valueStr.slice(0, decimalIndex + 3));
  }
  return value;
};

export const getTimeRemainingUntilAntUnblocked = (unblockDate: string | Date) => {
  // Get the current UTC+0 date
  const currentDate = DateTime.utc();

  // Add the unblocking Date to the current date
  const antUnblockedIn = currentDate.plus({ milliseconds: new Date(unblockDate).getTime() - currentDate.toMillis() });

  // Calculate the difference between the current time and the ending blocked period time
  const timeRemaining = antUnblockedIn.diff(currentDate);

  // Return the remaining time in milliseconds
  return timeRemaining.toMillis();
};

export const getDateTimeByColony = (colony: Colony, now?: boolean) => {
  let currentDate = DateTime.utc();
  if (now) {
    currentDate = DateTime.now();
  }
  if (colony.customTimeStamp) {
    return currentDate.plus({ days: colony.customTimeStamp });
  } else {
    return currentDate;
  }
};
