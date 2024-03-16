import useInstructors from '../../hooks/useInstructors';
import useAxios from '../../hooks/useAxios';

const Instructors = () => {
  const [instructors, refetch] = useInstructors();
  const Axios = useAxios();
  console.log(instructors)

  const handleSelectChange = async (e, id) => {
    const { value } = e.target;
    console.log(value, id)
    try {
       await Axios.patch(`/index/${id}`, { status: value })
      .then (res => {refetch()})
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  }

  return (
    <div className="rounded-lg overflow-hidden mx-4 md:mx-10">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
              Name
            </th>
            <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
              Email
            </th>
            <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
              Total Courses
            </th>
            <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {instructors.map(item => (
            <tr key={item.id} className="border-b border-black">
              <td className="py-4 px-6 ">{item?.firstname} {item?.lastname}</td>
              <td className="py-4 px-6 truncate">{item.email}</td>
              <td className="py-4 px-6 ">0</td>
              <td className="py-4 px-6 ">
              <select value={item.request} onChange={(e) => handleSelectChange(e, item.id)}
                name="request"
                className={`select w-30 px-3 py-2 rounded-full select-bordered ${
                    item.request === 'Approved' ? 'bg-green-400' : 
                    item.request === 'Blocked' ? 'bg-red-400' : ''
                }`}
                >

                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Blocked">Blocked</option>

                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Instructors;
