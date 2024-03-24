import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const GoogleLoginButton = ({ setShowOtpForm, email, setEmail }) => {

  const sendUserDataToBackend = (userData) => {
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
              toast.success(data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                onClose: () => setShowOtpForm(true) // When toast is closed, show OTP form
              });
          } else if(data.status === 400){
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
    <div>  
      <GoogleLogin
        onSuccess={credentialResponse => {
            let credentialResponseDecoded = jwtDecode(credentialResponse.credential);
            const { given_name, family_name, name, email } = credentialResponseDecoded;
            const userData = {
                firstname: given_name,
                lastname: family_name,
                username: name,
                email: email,
                password: given_name,
                role: "student"
            };
            setEmail(userData.email);
            sendUserDataToBackend(userData);
            
        }}
        onError={() => {
            console.log('Login Failed');
        }}
      />
    </div>
  );
};

export default GoogleLoginButton;
