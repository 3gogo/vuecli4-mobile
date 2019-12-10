import axios from './middleWare';

const setBookingAddBooking = params => axios.post('/plateno_mall/booking/addBooking', { ...params });

export default {
  setBookingAddBooking,
};
