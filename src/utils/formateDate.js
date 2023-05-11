export const formatDate = (dateString) => {
  const day = dateString.split('-')[2];
  const year = dateString.split('-')[0];
  const monthNumber = dateString.split('-')[1];
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const month = monthNames[Number(monthNumber) - 1];
  const formattedDate = `${month} ${day}, ${year}`;
  return formattedDate;
};
