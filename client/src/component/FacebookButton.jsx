import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";

const FacebookButton = () => {
    
const navigate = useNavigate();
const sendUserDataToBackend = (userData) => {
 console.log(userData)
    fetch('http://localhost:3001/users/google', {
        method: 'POST',
       
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            const Token = data.token;
            localStorage.setItem('token', Token.toString());
            toast.success(data.message, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              onClose: () => navigate('/')
            });
        }else if(data.status === 400){
        
            toast.error(data.message, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        })
    .catch(error => {
        console.error('Error sending user data to backend:', error);
    });
}

    return (
        <div className=''>
              <LoginSocialFacebook
           appId="398969442822456"
           onResolve={(response) => {
             console.log(response.data);
             const fbData = response.data;
             const { first_name, last_name, name, email } = fbData ;
             const userData = {
                 firstname: first_name,
                 lastname: last_name,
                 username: name,
                 email: email,
                 password: first_name,
                 role: "student"
             };
             console.log(userData)
             sendUserDataToBackend(userData);
            
           }}
           onReject={(error) => {
             console.log(error);
           }}
         >
           <FacebookLoginButton />

        </LoginSocialFacebook>
        </div>
    );
};

export default FacebookButton;