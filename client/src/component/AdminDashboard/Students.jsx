import useStudents from "../../hooks/useStudents";


const Students = () => {
    const [students, refetch] = useStudents();
    console.log(students)
    
    return (
        <div className="rounded-lg overflow-hidden mx-4 md:mx-10">
  <table className="w-full  ">
    <thead>
      <tr className="bg-gray-100">
        <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
          Name
        </th>
        <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
          Email
        </th>
        <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
          User Name
        </th>
       
      </tr>
    </thead>
    <tbody>
     {
        students.map(item => (
            <tr key={item.id}  className="border-b border-black ">
    <td className="py-4 px-6 ">{item?.firstname} {item?.lastname}</td>
   
    
            <td className="py-4 px-6 truncate">
                {item.email}
            </td>
           
            <td className="py-4 px-6 ">{item?.username}</td>
          
          </tr>
        ))
     }
    </tbody>
  </table>
</div>
    );
};

export default Students;