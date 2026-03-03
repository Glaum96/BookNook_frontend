const getDate = (time) => {
  const date = new Date(time);
  return date.toLocaleDateString();
};
const getTime = (time) => {
  const date = new Date(time);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
export {
  getTime as a,
  getDate as g
};
