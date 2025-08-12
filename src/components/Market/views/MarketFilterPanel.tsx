import React, { useEffect, useState } from 'react';
import Switch from 'rc-switch';
import Slider from 'rc-slider';
import 'rc-switch/assets/index.css';
import 'rc-slider/assets/index.css';
import MarketBloc from '../bloc/MarketBloc';
import { Button, Input } from 'reactstrap';
import { getTypeIconImgSrcByType } from '@ComponentsRoot/WelcomePack/views/PackCard';

/** Type definitions */
export type SortFilterMarketTypeOption = 'flying' | 'worker' | 'soldier';
export type SortFilterMarketRarityOption = 'common' | 'rare' | 'epic' | 'legendary';
export type SortFilterMarketOption = 'price' | 'power';

interface FilterState {
  isUpgraded: boolean;
  hpRange: [number, number];
  powerRange: [number, number];
  type: SortFilterMarketTypeOption[];
  rarity: SortFilterMarketRarityOption[];
  sortBy: SortFilterMarketOption;
  sortOrder: 'asc' | 'desc';
}

/** Rarity power range mapping */
const RARITY_POWER_RANGES: Record<SortFilterMarketRarityOption, [number, number]> = {
  common: [1, 50],
  rare: [51, 100],
  epic: [101, 150],
  legendary: [151, 200],
};

const typeOptions: SortFilterMarketTypeOption[] = ['soldier', 'flying', 'worker'];
const rarityOptions: SortFilterMarketRarityOption[] = ['common', 'rare', 'epic', 'legendary'];
const sortOptions: SortFilterMarketOption[] = ['price', 'power'];

const MarketFilterPanel = (props: { getMarketDataFn: MarketBloc['getMarketData']; currentPage: number; mynftsTab: boolean }) => {
  const [filters, setFilters] = useState<FilterState>({
    isUpgraded: false,
    hpRange: [0, 25],
    powerRange: [1, 200], // Default to "common" range
    type: typeOptions.map((t) => t), // Allow multiple selections
    rarity: rarityOptions.map((rar) => rar), // Allow multiple selections
    sortBy: props.mynftsTab ? 'power' : 'price', // Default sorting by price
    sortOrder: props.mynftsTab ? 'desc' : 'asc', // Default sorting order descending
  });

  // Adjust power range based on selected rarities
  const computePowerRange = (selectedRarities: SortFilterMarketRarityOption[]): [number, number] => {
    if (selectedRarities.length === 0) return [1, 200];
    const minPower = Math.min(...selectedRarities.map((r) => RARITY_POWER_RANGES[r][0]));
    const maxPower = Math.max(...selectedRarities.map((r) => RARITY_POWER_RANGES[r][1]));
    return [minPower, maxPower] as [number, number];
  };

  const mapFiltersToFullParams = (filters: FilterState) => ({
    ...filters,
    minHP: filters.hpRange[0],
    maxHP: filters.hpRange[1],
    minPower: filters.powerRange[0],
    maxPower: filters.powerRange[1],
    page: props.currentPage ?? 1,
    owner: props.mynftsTab,
    type: filters.type.length > 0 ? filters.type.join(',') : '',
    rarity: filters.rarity.length > 0 ? filters.rarity.join(',') : '',
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });

  useEffect(() => {
    (async () => {
      await props.getMarketDataFn(mapFiltersToFullParams(filters));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers
  const handleIsUpgradedChange = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, isUpgraded: checked }));
  };

  const handleHpRangeChange = (rangeValues: number[]) => {
    setFilters((prev) => ({ ...prev, hpRange: [rangeValues[0], rangeValues[1]] }));
  };

  const handlePowerRangeChange = (rangeValues: number[]) => {
    setFilters((prev) => ({ ...prev, powerRange: [rangeValues[0], rangeValues[1]] }));
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, sortBy: event.target.value as SortFilterMarketOption }));
  };

  const handleSortOrderToggle = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, sortOrder: checked ? 'desc' : 'asc' }));
  };

  const handleTypeClick = (typeValue: SortFilterMarketTypeOption) => {
    setFilters((prev) => {
      const newTypes = prev.type.includes(typeValue)
        ? prev.type.length > 1
          ? prev.type.filter((t) => t !== typeValue)
          : prev.type
        : [...prev.type, typeValue];

      return { ...prev, type: newTypes };
    });
  };

  const handleRarityClick = (rarityValue: SortFilterMarketRarityOption) => {
    setFilters((prev) => {
      const newRarities = prev.rarity.includes(rarityValue)
        ? prev.rarity.length > 1
          ? prev.rarity.filter((r) => r !== rarityValue)
          : prev.rarity
        : [...prev.rarity, rarityValue];

      return {
        ...prev,
        rarity: newRarities,
        powerRange: computePowerRange(newRarities), // Dynamically adjust power range
      };
    });
  };

  const applyFilters = async () => {
    console.log('Filters to apply:', filters);
    await props.getMarketDataFn(mapFiltersToFullParams(filters));
  };

  return (
    <div className='marketFilters'>
      {/* isUpgraded Switch */}
      <div className='filtTitle'>
        <span>FILTERS</span>
      </div>

      {/* Type Multi-Selection Buttons */}
      <div className='typeAndRarity'>
        <div className='firstZ'>
          <div className='typeLabel'>Type</div>
          <div className='typeFiltersZone'>
            {typeOptions.map((t) => (
              <Button
                key={t}
                onClick={() => handleTypeClick(t)}
                className='typeFiltBtn'
                style={{
                  filter: filters.type.includes(t)
                    ? 'unset'
                    : 'drop-shadow(1px 1px 3px #a14b26) drop-shadow(0px 0px 6px rgba(58, 24, 8, 1)) drop-shadow(0px 0px 4px rgba(255, 132, 0, 0.8)) drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.5))',
                }}
              >
                <img src={getTypeIconImgSrcByType(t.toLowerCase())} alt='rarity small ico' />
                <span>{t.toUpperCase()}</span>
              </Button>
            ))}
          </div>
        </div>
        <div className='secondZ'>
          {/* Rarity Multi-Selection Buttons */}
          <div className='rarityLabel'>Rarity</div>
          <div className='rarityFiltersZone'>
            {rarityOptions.map((r) => (
              <Button
                key={r}
                onClick={() => handleRarityClick(r)}
                className={`rarityFiltBtn ${r.toLowerCase()}`}
                style={{
                  filter: filters.rarity.includes(r)
                    ? 'unset'
                    : 'drop-shadow(1px 1px 3px #a14b26) drop-shadow(0px 0px 6px rgba(58, 24, 8, 1)) drop-shadow(0px 0px 4px rgba(255, 132, 0, 0.8)) drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.5))',
                }}
              >
                <img src={`/images/finals/icons/${r.toLowerCase()}.png`} alt='rarity small ico' /> {r.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <label className='upgradedZone'>
        <span>Upgraded</span>
        <Switch className='custSwitch' checked={filters.isUpgraded} onChange={handleIsUpgradedChange} />
      </label>

      <div className='rangesAndSort'>
        <div className='rangesZone'>
          {/* HP Range */}
          <div className='hpRange'>
            <span>
              <img src='/images/finals/icons/bandage.png' alt='bandage' />
              <span>HP:</span> {filters.hpRange[0]}-{filters.hpRange[1]}
            </span>
            <Slider range min={0} max={25} value={filters.hpRange} onChange={(vals) => handleHpRangeChange(vals as number[])} />
          </div>
          {/* Power Range (Now dynamically adjusts based on selected rarities) */}
          <div className='powerRange'>
            <span>
              <img src='/images/finals/icons/power_1.png' alt='power sign' />
              <span>Power:</span> {filters.powerRange[0]}-{filters.powerRange[1]}
            </span>
            <Slider
              range
              min={Math.min(...filters.rarity.map((r) => RARITY_POWER_RANGES[r][0])) || 1} // ✅ Min power from selected rarities
              max={Math.max(...filters.rarity.map((r) => RARITY_POWER_RANGES[r][1])) || 200} // ✅ Max power from selected rarities
              value={filters.powerRange} // ✅ Keeps correct ball positioning
              onChange={(vals) => handlePowerRangeChange(vals as number[])}
            />
          </div>
        </div>

        {/* Sort By Dropdown */}
        <div className='sortByZone'>
          <label>
            <span>Sort By:</span>
            <Input
              type='select'
              name='sortBy'
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e)}
              style={{ padding: '3px' }}
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </Input>
          </label>
          {/* Sort Order Toggle */}
          <label style={{ display: 'flex' }}>
            <span>Descending</span>
            <Switch className='custSwitch' checked={filters.sortOrder === 'desc'} onChange={handleSortOrderToggle} />
          </label>
        </div>
      </div>

      <div className='applyBtnZone'>
        {/* Apply Button */}
        <Button className='applyFiltBtn' onClick={async () => await applyFilters()}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default MarketFilterPanel;
