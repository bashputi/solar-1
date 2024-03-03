

const StudentDashboard = () => {
    const course = [
        {
            id: 1,
            status: "Enrolled Courses",
            image: 'https://i.ibb.co/WFy5RZJ/Screenshot-2024-03-03-095152-removebg-preview.png',
            count: 1
          },
        {
            id: 1,
            status: "Active Courses",
            image: 'https://i.ibb.co/ZLZnhgd/Screenshot-2024-03-03-095331-removebg-preview.png',
            count: 1
          },
        {
            id: 1,
            status: "Completed Courses",
            image: 'https://i.ibb.co/vqv63HB/Screenshot-2024-03-03-095429-removebg-preview.png',
            count: 0
          },
    ]
    return (
        <div className="my-8 mx-8">
           <div className="text-xl font-semibold "> Dashboard</div>
           <div>
                <div className="flex my-10">
                    {
                        course.map((item) => (
                            <div key="item.id" className="border-boxborder-solid px-12 p-12 grid justify-center  mr-10 w-96  border-2 border-indigo-600">
                               <div className="flex justify-center"> <img className="w-12" src={item.image} alt="image" /></div>
                                <p className="text-center text-5xl font-bold my-8">{item.count}</p>
                                <p className="text-gray-500 font-semibold" >{item.status}</p>
                            </div>
                        ))
                    }
                </div>
           </div>
        </div>
    );
};

export default StudentDashboard;