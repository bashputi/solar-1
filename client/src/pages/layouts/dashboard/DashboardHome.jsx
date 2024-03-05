import useUser from "../../../hooks/useUser";
import StudentDashboard from "../../../component/StudentDashboard/StudentDashboard";



const DashboardHome = () => {
    const [currentUser] = useUser();

    return (
        <div>
            {
                // currentUser?.role === 'student' && 
                <>
        {/* <StudentDashboard /> */}
                </>
            }
           
        </div>
    );
};

export default DashboardHome;