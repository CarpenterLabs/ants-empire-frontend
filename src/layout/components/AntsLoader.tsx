import "../styles/AntsLoader.scss";
export const AntsLoader = () => {
  return (
    <div className="overlay animated fadeIn">
      <div className="overlay__inner">
        <div className="overlay__content">
          <img src="/images/dance-nobg.gif" alt="ants loader" />
        </div>
      </div>
    </div>
  );
};

export const renderLoaderIfNeeded = (isLoading: boolean): JSX.Element => {
  return isLoading ? <AntsLoader /> : <></>;
};
