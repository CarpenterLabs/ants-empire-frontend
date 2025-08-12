import { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Table, Row, Col, Button } from 'reactstrap';

import Style from '../styles/CPanelOracleView.module.scss';
import { CPanelOracleViewProps } from '../types/CPanelOracleSubject';
import { OracleData } from '../../CPanelStandard/types/ControlPanelSubject';
import { differenceObj, isEqual } from '@ComponentsRoot/core/CryptoAntsUtils';

const CPanelOracleView = (props: CPanelOracleViewProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [editableOracle, setEditableOracle] = useState<Pick<OracleData, 'internal_price' | 'nectar_price'>>({
    nectar_price: props.cpanelOracleData.oracleParams.nectar_price,
    internal_price: props.cpanelOracleData.oracleParams.nectar_price,
  });
  const [backupOracle, setBackupOracle] = useState<Pick<OracleData, 'internal_price' | 'nectar_price'>>({
    nectar_price: props.cpanelOracleData.oracleParams.nectar_price,
    internal_price: props.cpanelOracleData.oracleParams.nectar_price,
  });

  useEffect(() => {
    if (!props.subjectValue.oracleData && !props.subjectValue.initialData) {
      props.bloc.setOracleTempData(props.cpanelOracleData ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isPreview) {
      props.bloc.setOracleNewData(props.cpanelOracleData ?? null);
    } else {
      (async () => {
        if (props.cpanelOracleData && props.subjectValue.initialData) {
          const diff: object = differenceObj(props.cpanelOracleData, props.subjectValue.initialData);
          if (props.cpanelOracleData === undefined || !isEqual(props.cpanelOracleData, []) || !Object.keys(diff).length) {
            props.bloc.setOracleTempData(props.cpanelOracleData ?? null);
          }
        }
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.cpanelOracleData]);

  const handleChange = (key: keyof OracleData, value: string) => {
    setEditableOracle((prev) => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }));
  };

  const handleEdit = () => {
    setBackupOracle({ ...editableOracle }); // Snapshot before editing
    setIsEditing(true);
    setIsPreview(false);
  };

  const handlePreview = async () => {
    await props.bloc.providerProps.cpanelBloc.saveOrPreviewOracleNewValues(editableOracle.nectar_price, 'draft');
    setIsPreview(true);
  };

  const handleSave = async () => {
    await props.bloc.providerProps.cpanelBloc.saveOrPreviewOracleNewValues(editableOracle.nectar_price, 'live');
    setIsEditing(false);
    setIsPreview(false);
  };

  const handleCancel = () => {
    setEditableOracle({ ...backupOracle }); // Revert changes
    props.bloc.setOracleNewData(props.subjectValue.initialData!);
    setIsEditing(false);
    setIsPreview(false);
  };

  const renderEditableOraclePanel = () => {
    const entries = Object.entries(editableOracle).filter(([_, value]) => value !== undefined);

    return (
      <Card
        className='mb-4 shadow-sm'
        style={{
          backgroundColor: '#f5fbff',
          ...(isEditing ? { border: '1px solid orange' } : {}),
        }}
      >
        <CardBody>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <CardTitle tag='h6' className='mb-0'>
              {`Core variables`}
            </CardTitle>
            <div>
              {isEditing && (
                <>
                  <Button color='secondary' className='create-btn m-1' onClick={handleCancel}>
                    Cancel
                  </Button>

                  {!isPreview && (
                    <Button color='warning' className='create-btn m-1' onClick={async () => await handlePreview()}>
                      Preview
                    </Button>
                  )}

                  {isPreview && (
                    <Button color='success' className='create-btn m-1' onClick={async () => await handleSave()}>
                      Save
                    </Button>
                  )}
                </>
              )}

              {!isEditing && (
                <Button color='primary' className='create-btn' onClick={handleEdit}>
                  Edit
                </Button>
              )}
            </div>
          </div>
          <Row>
            {entries.map(([key, value]) => (
              <Col md='6' sm='12' key={key} className='mb-2'>
                <strong>{formatKey(key)}:</strong>{' '}
                {isEditing ? (
                  <input
                    type='number'
                    step='any'
                    disabled={key === 'internal_price'}
                    className='form-control form-control-sm mt-1'
                    value={editableOracle[key]}
                    onChange={(e) => handleChange(key as keyof OracleData, e.target.value)}
                  />
                ) : (
                  <span className='ms-1'>{typeof value === 'number' ? value.toFixed(4) : value}</span>
                )}
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    );
  };

  const formatKey = (key: string) =>
    key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/\b\w/g, (l) => l.toUpperCase());

  // const renderObject = (title: string, data: Record<string, number | string | undefined>) => {
  //   const entries = Object.entries(data).filter(([_, value]) => value !== undefined);

  //   return (
  //     <Card className='mb-4 shadow-sm' key={title}>
  //       <CardBody>
  //         <CardTitle tag='h6' className='mb-3'>
  //           {formatKey(title)}
  //         </CardTitle>
  //         <Row>
  //           {entries.map(([key, value]) => (
  //             <Col md='6' sm='12' key={key} className='mb-2'>
  //               <strong>{formatKey(key)}:</strong> {typeof value === 'number' ? value.toFixed(4) : value}
  //             </Col>
  //           ))}
  //         </Row>
  //       </CardBody>
  //     </Card>
  //   );
  // };

  const renderArray = <T extends Record<string, number | string>>(title: string, items: T[]) => {
    if (items.length === 0) return null;

    const columns = Object.keys(items[0]);

    // Columns that should be displayed as integers
    const intFields = ['destinationId', 'level', 'packId'];

    return (
      <Card className='mb-4 shadow-sm p-2' key={title}>
        <CardBody>
          <CardTitle tag='h6' className='mb-3'>
            {isPreview ? <span style={{ color: 'orange' }}>PREVIEW VALUES</span> : <></>}
            {/* {`${isPreview ? 'PREVIEW VALUES' : ''}`} */}
            <br></br>
            {formatKey(title)}
          </CardTitle>
          <Table bordered size='sm' responsive>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{formatKey(col)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => {
                    const value = row[col];
                    let displayValue = value;

                    if (typeof value === 'number') {
                      displayValue = intFields.includes(col)
                        ? parseInt(value.toString()) // Force to int
                        : value.toFixed(4); // Keep 4 decimals
                    }

                    return <td key={col}>{displayValue}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    );
  };

  // const renderPackToBuyValues = (data: Record<string, { packToBuyId: string; price: number }[]>) => {
  //   return Object.entries(data).map(([category, packs]) => (
  //     <Card className='mb-4 shadow-sm' key={category}>
  //       <CardBody>
  //         <CardTitle tag='h6' className='mb-3'>
  //           {formatKey(category)}
  //         </CardTitle>
  //         <Table bordered size='sm' responsive>
  //           <thead>
  //             <tr>
  //               <th>Pack</th>
  //               <th>Price</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {packs.map((pack, i) => (
  //               <tr key={i}>
  //                 <td>{pack.packToBuyId}</td>
  //                 <td>{pack.price.toFixed(2)}</td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </Table>
  //       </CardBody>
  //     </Card>
  //   ));
  // };

  const renderContent = () => {
    const data = props.subjectValue.oracleData;
    if (!data) return null;

    return (
      <>
        {renderEditableOraclePanel()}
        {/* {renderObject('axeValue', data.axeValue)} */}
        {/* {renderObject('sellerValue', data.sellerValue)} */}
        <div className='tablesInfo'>
          {renderArray('expeditionValues', data.expeditionValues)}
          {renderArray('upgradeRoomValues', data.upgradeRoomValues)}
          {renderArray('packToBuyValues', data.packToBuyValues)}
          {/* {renderArray('powerTicketValues', data.powerTicketValues)} */}
          {renderArray('materialBoxValues', data.materialBoxValues)}
          {renderArray('hpPackValues', data.hpPackValues)}
          {/* {renderArray('powerTicketQuestValues', data.powerTicketQuestValues)} */}
        </div>
      </>
    );
  };

  return (
    <div className={Style.CPanelOracleView}>
      <h5 className='mb-2'>{`Oracle Values ${isEditing ? (isPreview ? '(Preview)' : '(Editing)') : ''}`}</h5>
      <div className='oracleData-region'>{props.subjectValue.oracleData && renderContent()}</div>
    </div>
  );
};

export default CPanelOracleView;
