import { DateRangePicker } from 'react-date-range';
import { format } from 'date-fns';
import { useState } from 'react';
import useAxios from "../../hooks/useAxios";
import useUser from "../../hooks/useUser";

const Shedule = () => {
    const Axios = useAxios();
    const [currentUser, refetch] = useUser();
    const [openDate, setOpenDate] = useState(false);

    const [date, setDate] = useState({
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
      );
      console.log(date)
    const handleChange = (ranges) => {
        setDate(ranges.selection);
    };
    const handleClick = () => { setOpenDate((prev) => !prev)};

    const handleApply = () => {
        const Item = {
            startDate: date.startDate,
            endDate: date.endDate
        };
   Axios.patch(`/schedule/${currentUser.id}`, Item)
   .then(res => console.log(res))
    };


    return (
     <div className='pl-4'>
        <h1 className='text-2xl font-bold pt-8 pb-3 '>Scheduled Events</h1>
        <p className='pb-8 '>Your classes will start from <span className='text-green-600 font-semibold'>{`${format(date.startDate, 'dd/MM/yyyy')}`}</span> to <span className='text-green-600 font-semibold'>{`${format(date.endDate, 'dd/MM/yyyy')}`}</span>.</p>
        <div className=''>
            <span onClick={handleClick} className="group mb-10 relative w-36 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Make Schedule</span>
       {
        openDate &&    (
            <div className='bg-white rounded-lg px-5 py-5 w-[50vw]'>
                  <DateRangePicker
        onChange={handleChange}
        ranges={[date]}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        direction="horizontal"
        minDate={new Date()}
        />
       <div className='flex justify-center gap-5'>
       <button onClick={handleClick} className="group mt-10 relative w-28 flex justify-center py-2  border border-transparent text-sm font-medium rounded-md   hover:underline ">Cancel</button>
       <button onClick={handleApply} className="group mt-10 relative w-28 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Apply</button>
       </div>
         </div>
        )
       }
        </div>
     </div>
    );
};

export default Shedule;