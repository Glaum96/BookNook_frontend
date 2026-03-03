import { d as derived, w as writable } from "./index.js";
const loadingStates = writable({
  bookings: false,
  myBookings: false,
  users: false,
  login: false,
  register: false,
  calendar: false,
  postBooking: false,
  deleteBooking: false,
  updateUser: false,
  deleteUser: false
});
function isLoading(key) {
  return derived(loadingStates, ($states) => $states[key]);
}
derived(loadingStates, ($states) => Object.values($states).some((v) => v));
export {
  isLoading as i
};
