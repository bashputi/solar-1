import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const sendUserDataToBackend = (userData) => {
   console.log(userData)
      fetch('https://vercel-solar.vercel.app/users/google', {
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
    <div>
           <GoogleLogin
            onSuccess={credentialResponse => {
                console.log(credentialResponse);
                let credentialResponseDecoded = jwtDecode(credentialResponse.credential);
                console.log(credentialResponseDecoded);
               
                const { given_name, family_name, name, email } = credentialResponseDecoded;
                console.log({ given_name, family_name, name, email } )
                const userData = {
                    firstname: given_name,
                    lastname: family_name,
                    username: name,
                    email: email,
                    password: given_name,
                    role: "student"
                };
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