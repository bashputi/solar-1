import { useState, useEffect } from 'react';
import useAxios from "../../hooks/useAxios";
import useUser from "../../hooks/useUser";
import { DateRangePicker } from 'react-date-range';
import { format } from 'date-fns';

const Schedule = () => {
    const Axios = useAxios();
    const [currentUser, refetch] = useUser();
    const [selectedDays, setSelectedDays] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [startTimes, setStartTimes] = useState(Array(7).fill('13:00')); 
    const [endTimes, setEndTimes] = useState(Array(7).fill('17:00')); 

    useEffect(() => {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        setEndDate(endDate);
    }, [startDate]);

    const [endDate, setEndDate] = useState(() => {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        return endDate;
    });

    const handleCheckboxChange = (day, currentDate) => {
        setSelectedDays(prevSelectedDays => {
            if (prevSelectedDays.some(selectedDay => selectedDay.day === day)) {
                return prevSelectedDays.filter(selectedDay => selectedDay.day !== day);
            } else {
                return [...prevSelectedDays, { day, date: currentDate.toLocaleDateString() }];
            }
        });
    };

    const handleStartTimeChange = (index, value) => {
        const newStartTimes = [...startTimes];
        newStartTimes[index] = value;
        setStartTimes(newStartTimes);
    };

    const handleEndTimeChange = (index, value) => {
        const newEndTimes = [...endTimes];
        newEndTimes[index] = value;
        setEndTimes(newEndTimes);
    };

    const handleApply = () => {
        if (selectedDays.length === 0) {
            alert('Please select at least one day.');
            return;
        }

        const data = selectedDays.map(({ day, date }, index) => ({
            day,
            date,
            startTime: startTimes[index],
            endTime: endTimes[index]
        }));
        console.log(data)

        Axios.patch(`/time/${currentUser.id}`, data)
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.error(error);
            });
    };

    // Calendar function 
    const [openDate, setOpenDate] = useState(false);
    const [date, setDate] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    const handleChange = (ranges) => {
        setDate(ranges.selection);
    };

    const handleClick = () => {
        setOpenDate((prev) => !prev);
    };

    const handleApp = () => {
        const Item = {
            startDate: date.startDate,
            endDate: date.endDate
        };
        
        Axios.patch(`/schedule/${currentUser.id}`, Item)
            .then(res => console.log(res))
            .catch(error => console.error(error));
    };

    return (
        <div>
            <div className='pl-4'>
                <h1 className='text-2xl font-bold pt-8 pb-3 '>Scheduled Events</h1>
                <p className='pb-8 '>Your classes will start from <span className='text-green-600 font-semibold'>{`${format(date.startDate, 'dd/MM/yyyy')}`}</span> to <span className='text-green-600 font-semibold'>{`${format(date.endDate, 'dd/MM/yyyy')}`}</span>.</p>
                <div className=''>
                    <span onClick={handleClick} className="group mb-10 relative w-36 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Make Schedule</span>
                    {openDate && (
                        <div className='bg-white rounded-lg px-5 py-5 w-[50vw]'>
                            <DateRangePicker
                                onChange={handleChange}
                                ranges={[date]}
                                showSelectionPreview={true}
                                moveRangeOnFirstSelection={false}
                                months={2} 
                                minDate={new Date()}
                            />
                            <div className='flex justify-center gap-5'>
                                <button onClick={handleClick} className="group mt-10 relative w-28 flex justify-center py-2 border border-transparent text-sm font-medium rounded-md hover:underline ">Cancel</button>
                                <button onClick={handleApp} className="group mt-10 relative w-28 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Apply</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='pl-4'>
                <h1 className='text-2xl font-semibold mb-5'>Schedule Time Frames</h1>
                <form className='bg-white w-[50vw] px-8 py-8 rounded-lg'>
                    {[...Array(7)].map((_, index) => {
                        const currentDate = new Date(startDate);
                        currentDate.setDate(currentDate.getDate() + index);
                        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
                        const formattedDate = currentDate.toLocaleDateString(); // Get formatted date
                        
                        return (
                            <div key={index} className='mb-8 text-xl'>
                                <input
                                    type="checkbox"
                                    checked={selectedDays.some(selectedDay => selectedDay.day === dayName)}
                                    onChange={() => handleCheckboxChange(dayName, currentDate)}
                                    className='mr-4'
                                />
                                <label className='font-semibold mr-8'>{dayName}</label>
                                <span className='mr-16'>({formattedDate})</span> {/* Include formatted date */}
                                <input
                                    type="time"
                                    value={startTimes[index]}
                                    onChange={e => handleStartTimeChange(index, e.target.value)}
                                    className='border border-black px-4 py-2 rounded-lg'
                                />
                                <span className='mx-5'>-</span>
                                <input
                                    type="time"
                                    value={endTimes[index]}
                                    onChange={e => handleEndTimeChange(index, e.target.value)}
                                    className='border border-black px-4 py-2 rounded-lg'
                                />
                            </div>
                        );
                    })}
                    <button className="group mt-10 relative w-28 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600" type="button" onClick={handleApply}>Apply</button>
                </form>
            </div>
        </div>
    );
};

export default Schedule;
