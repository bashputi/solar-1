import { useState, useEffect } from 'react';
import useAxios from "../../hooks/useAxios";
import useUser from "../../hooks/useUser";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Schedule = () => {
    const Axios = useAxios();
    const [currentUser, refetch] = useUser();
    const [selectedDays, setSelectedDays] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [startTimes, setStartTimes] = useState(Array(7).fill('13:00')); 
    const [endTimes, setEndTimes] = useState(Array(7).fill('17:00')); 
    const [dataSaved, setDataSaved] = useState(() => {
        const savedData = localStorage.getItem('dataSaved');
        return savedData ? JSON.parse(savedData) : false;
    });

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

    const generateTimeSlots = (day, date, startTime, endTime) => {
        const timeSlots = [];
        const start = new Date(`${date} ${startTime}`);
        const end = new Date(`${date} ${endTime}`);
        
        while (start < end) {
            const timeString = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;
            timeSlots.push({
                day,
                date,
                time: timeString
            });
            start.setHours(start.getHours() + 1);
        }
    
        return timeSlots;
    };
    
    const handleApply = () => {
        if (selectedDays.length === 0) {
            alert('Please select at least one day.');
            return;
        }
    
        const timeSlots = [];
        selectedDays.forEach(({ day, date}, index) => {
           
            const startTime = startTimes[index];
            const endTime = endTimes[index];
            const slots = generateTimeSlots( day, date, startTime, endTime);
            timeSlots.push(...slots);
        });

        Axios.post(`/time/${currentUser.id}`, timeSlots)
            .then(res => {
                console.log(res);
                toast.success(res.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                  });
                setDataSaved(true); 
                localStorage.setItem('dataSaved', true); 
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleDelete = () => {
     Axios.delete(`/schedule/${currentUser.id}`)
     .then(res => {
        toast.success(res.data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
            setDataSaved(false); 
            localStorage.setItem('dataSaved', false);
     })
    };

    return (
        <div>
            <div className='pl-4'>
                <h1 className='text-2xl font-semibold mb-5'>Schedule Time Frames</h1>
                <form className='bg-white w-[50vw] px-8 py-8 rounded-lg'>
                    {[...Array(7)].map((_, index) => {
                        const currentDate = new Date(startDate);
                        currentDate.setDate(currentDate.getDate() + index);
                        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
                        const formattedDate = currentDate.toLocaleDateString(); 
                        
                        return (
                            <div key={index} className='mb-8 text-xl'>
                                <input
                                    type="checkbox"
                                    checked={selectedDays.some(selectedDay => selectedDay.day === dayName)}
                                    onChange={() => handleCheckboxChange(dayName, currentDate)}
                                    className='mr-4'
                                />
                                <label className='font-semibold mr-8'>{dayName}</label>
                                <span className='mr-16'>({formattedDate})</span> 
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
                    {dataSaved ? (
                        <button className="group mt-10 relative w-28 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600" type="button" onClick={handleDelete}>Delete</button>
                    ) : (
                        <button className="group mt-10 relative w-28 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600" type="button" onClick={handleApply}>Apply</button>
                    )}
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Schedule;
