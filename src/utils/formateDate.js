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


export function formatDateTime(inputDateTime) {
    const date = new Date(inputDateTime);
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ];
    
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    let hour = date.getHours();
    let minute = date.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    
    hour = hour % 12;
    hour = hour ? hour : 12;
    minute = minute < 10 ? `0${minute}` : minute;
    
    const formattedDateTime = `${month} ${day}, ${year} at ${hour}:${minute} ${ampm}`;
    return formattedDateTime;
}
