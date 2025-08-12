import CustomModal from '@ComponentsRoot/core/CustomModal';
import BlackSmithBloc from '../bloc/BlackSmithBloc';
import { BlackSmithSubject } from '../types/BlackSmithSubject';
import Style from '../styles/blackSmithView.module.scss';
import { Row, Col, Button } from 'reactstrap';
import { BlackSmith, FarmingTool, getToolSrcByToolId } from '../types/BlackSmith';
import { renderToastrIfNeeded } from '@ComponentsRoot/Toastr/ToastrManager';
import { renderLoaderIfNeeded } from '@Layout/components/AntsLoader';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { useOutletContext } from 'react-router-dom';
import { WorkShop } from '@ComponentsRoot/Colony/types/RoomType';
import { MATERIAL_LIST } from '@ComponentsRoot/constants/iconLists';

export type BlackSmithViewPropsType = {
  bloc: BlackSmithBloc;
  subjectValue: BlackSmithSubject;
  blackSmith: BlackSmith;
  colonyData: Colony;
  isOpen: boolean;
};

export const getMaterialEmojiByToolRequirement = (toolId: number, materialId: number, width='14px') => {
  if (toolId === 1) {
    return <img alt='Nectar Logo' style={{ width: width }} src={`/images/finals/icons/nectar.png`} />;
  } else {
    const match = MATERIAL_LIST.find((m) => m.id === materialId);
    return <img alt={match!.alt} style={{ width: width }} src={match?.src} />;
  }
};

const BlackSmithView = (props: BlackSmithViewPropsType) => {
  // const { isConnected, address } = useAccount();
  // Outlet context const declaration, that way we can access the top level context wihtout passing it as a prop
  const outletContext: OutletContextType = useOutletContext<OutletContextType>();

  // current workshop room info
  const workShopRoom: WorkShop = props.colonyData.rooms.find((room) => room.roomId === 4)!;

  const renderToolCosts = (tool: FarmingTool) => {
    return (
      <div className={`grid-upgrade-modal fadeIn`}>
        {tool.cost.map((cost, key) => {
          return (
            <div
              key={key}
              className={`material-required ${
                !props.bloc.playerHaveEnoughMaterialForGivenTool(tool, props, outletContext) ? 'unavailable' : ''
              }`}
            >
              <div className={`material-box type-${cost.materialId}`}>
                <span>
                  {tool.toolId === 1 ? (
                    <img alt='Nectar Logo' style={{ width: '25px' }} src={`/images/finals/icons/nectar.png`} />
                  ) : (
                    <img
                      alt={MATERIAL_LIST.find((m) => m.id === cost.materialId)?.alt}
                      // style={{ width: '30px' }}
                      src={MATERIAL_LIST.find((m) => m.id === cost.materialId)?.src}
                    />
                  )}
                </span>
              </div>
              <div className='price'>
                <div className='old-price'>{cost.quantity}</div>
                <div className='final-price'>{cost.priceWithDiscountApplied}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const mountBlackSmithModalBody = () => {
    return (
      <div className={`${Style.blackSmithView} fadeIn`}>
        <div className='general-blackSmith-container'>
          <Row className='mainWrapper'>
            <Col className="picContainer" lg='5'>
              <img className='blackSmithPic' src={`/images/finals/npcs/Beetle.png`} alt='blackSmith' />
            </Col>
            <Col lg='7'>
              <div className='availableToolsArea'>
                <div className='farmingToolTopBox'>
                  {props.blackSmith.farmingTools.map((tool, idx) => (
                    <div className='tool-type' key={idx}>
                      <div
                        className={`farmingTool ${
                          !props.bloc.playerHaveEnoughMaterialForGivenTool(tool, props, outletContext) ? 'disabled' : ''
                        }`}
                      >
                        <div className='box-info'>
                          <span className='toolIcon'>
                            <img src={getToolSrcByToolId(tool.toolId)?.src} alt='icn' />
                          </span>
                          <div className='nameDescriptionAndPriceContainer'>
                            <span className='toolName'>{tool.name}</span>
                            <span className='toolDesc'>{tool.description}</span>
                          </div>
                        </div>

                        <div className='box-buy'>
                          <div className='toolCost'>{renderToolCosts(tool)}</div>
                          <div
                            className={`btnArea ${
                              !props.bloc.playerHaveEnoughMaterialForGivenTool(tool, props, outletContext) ? 'disabled' : ''
                            }`}
                          >
                            <Button
                              className='buyToolButton'
                              disabled={!props.bloc.playerHaveEnoughMaterialForGivenTool(tool, props, outletContext)}
                              onClick={async () => await props.bloc.buyTool(tool.toolId, outletContext, props.colonyData)}
                            >
                              <img src='/images/finals/blacksmith/cart_icon.png' alt='cartIcon' />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className='discountByLvlTitle'>Discount by Level</div>
              <div className='discountByLvlsInfoZone'>
                <div className='inside header'>
                  <span className='lvSpan'>{props.bloc.providerProps.intl.formatMessage({ id: 'LV' })}</span>
                  <span>{props.bloc.providerProps.intl.formatMessage({ id: 'colony.tool.hacha' })}</span>
                  <span>{props.bloc.providerProps.intl.formatMessage({ id: 'colony.tool.pico' })}</span>
                  <span>{props.bloc.providerProps.intl.formatMessage({ id: 'colony.tool.pala' })}</span>
                  <span>{props.bloc.providerProps.intl.formatMessage({ id: 'colony.tool.cubo' })}</span>
                  <span>{props.bloc.providerProps.intl.formatMessage({ id: 'colony.tool.regadera' })}</span>
                </div>
                <div className='verticalContainer'>
                  {Object.keys(workShopRoom.discount_by_levels!).map((key: string, idxLoop) => {
                    return (
                      <div className={`inside levelRow ${workShopRoom.level === parseInt(key) ? 'currentLevel' : ''}`} key={key}>
                        {<div className={`cell lvlCell ${idxLoop % 2 ? 'even' : 'odd'}`}>{idxLoop + 1}</div>}
                        {Object.keys(workShopRoom.discount_by_levels![key]).map((levelDiscountInfoKey, toolIndex) => {
                          return (
                            <div className='cell' key={levelDiscountInfoKey}>
                              {workShopRoom.discount_by_levels![key][levelDiscountInfoKey].map((cost, idx) => (
                                <div className='costData' key={key}>
                                  <span>
                                    {getMaterialEmojiByToolRequirement(toolIndex + 1, cost.materialId)} {cost.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  return (
    <>
      {props.isOpen && (
        <CustomModal
          size={'xl'}
          body={mountBlackSmithModalBody()}
          open
          class='blackSmithModalMain'
          title={props.bloc.providerProps.intl.formatMessage({ id: 'colony.blackSmith' })}
          togglerModal={() => props.bloc.closeModal()}
          modalHeaderClassName='standarModalHeader'
        />
      )}
      {renderLoaderIfNeeded(props.subjectValue.isLoading)}
      {renderToastrIfNeeded(props.subjectValue.toastr, props.bloc.resetSubjectActions, props.bloc.providerProps.intl)}
    </>
  );
};

export default BlackSmithView;
