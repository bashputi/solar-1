import { useState } from 'react';
import useSchedule from "../../hooks/useSchedule";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import useAxios from "../../hooks/useAxios";
import useUser from "../../hooks/useUser";


const Enrolled = () => {
  const Axios = useAxios();
  const [currentUser] = useUser();
  const [schedule, refetch] = useSchedule();
  const [selectedDate, setSelectedDate] = useState(null);
console.log(schedule)
  
  const groupedSchedules = {};
  console.log(groupedSchedules)
  schedule.forEach(item => {
    if (!groupedSchedules[item.date]) {
      groupedSchedules[item.date] = [];
    }
    groupedSchedules[item.date].push(item);
  });

  const handleDateClick = (date) => {
    setSelectedDate(date);
    console.log(date)
  };

  const handleButtonClick = async(id) => {
    console.log("Clicked schedule id:", id);
   await Axios.patch(`/booked/${id}`,{email: currentUser.email})
   .then(res => console.log(res))
  };

  return (
    <div className='flex '>
 <Calendar
  onChange={handleDateClick}
  value={selectedDate}
  tileContent={({ date }) => {
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    if (groupedSchedules[formattedDate]) {
      return <div></div>;
    }
  }}
  tileDisabled={({ date }) => {
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return !groupedSchedules[formattedDate];
  }}
/>
{selectedDate && (
        <div className='bg-white py-5 text-xl font-semibold rounded-md px-5'>
          {selectedDate.toLocaleDateString()}:
          {groupedSchedules[selectedDate.toLocaleDateString()] && groupedSchedules[selectedDate.toLocaleDateString()].map(schedule => (
            <button 
              className='block group relative w-36 py-2.5 my-3 px-4 text-sm font-medium rounded-md text-white bg-amber-500 '
              key={schedule.id}
              onClick={() => handleButtonClick(schedule.id)} // Pass id to handleButtonClick function
            >
              {schedule.time}
            </button>
          ))}   </div>
          )}
    </div>
  );
};

export default Enrolled;
