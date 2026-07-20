const getISTDate = () => {
  const todayUTC = new Date();
  todayUTC.setHours(0, 0, 0, 0);
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;
  const todayIST = new Date(todayUTC.getTime() + IST_OFFSET);
  return todayIST;
};

module.exports = { getISTDate };
