// Direct React component imports
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { Pagination, Navigation } from 'swiper';

// Import Swiper styles
import 'swiper/scss';
import 'swiper/scss/navigation'
import 'swiper/scss/pagination'

import Style from './styles/CryptoAntsSlider.module.scss';

export const CryptoAntsSlider = (props: { sliderData: JSX.Element[] }) => {
  return (
    <div className={Style.CryptoAntsSlider}>
      <Swiper
        navigation
        // slidesPerView={3}
        spaceBetween={25}
        // centeredSlides={true}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination, Navigation]}
        className='mySwiper'
        breakpoints={{
          0: {
            slidesPerView: 3,
          },
          1100: {
            slidesPerView: 2,
          }
        }}
      >
        {props.sliderData.map((item, idx) => {
          return <SwiperSlide key={idx}>{item}</SwiperSlide>;
        })}
        {/* <SwiperSlide>
          <p>Slide 1</p>
        </SwiperSlide> */}
        {/* <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide> */}
      </Swiper>
    </div>
  );
};
