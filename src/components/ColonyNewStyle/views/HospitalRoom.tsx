export default function HospitalRoom(props: { onClickHospitalFn: () => void }) {
  return (
    <div className='hospitalRoomContent'>
      <div className='hospitalButton' onClick={props.onClickHospitalFn}>
        <img src={`/images/hospitalv1.png`} alt='Hospital' />
      </div>     
    </div>
  );
}
