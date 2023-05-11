export const convertTime = (dateString) => {
    const dateTime = new Date(dateString);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const date = dateTime.toLocaleDateString('en-US', options);
    return date;
};