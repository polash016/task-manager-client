import React, { useContext } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

const SocialLogin = () => {
    const {googleLogin} = useContext(AuthContext);
    const navigate = useNavigate();
    const handleGoogleLogin = () => {
        googleLogin()
        .then(result => {
            const loggedUser = result.user;
            console.log(loggedUser)
            navigate('/')
        })
        .catch(err => {
            console.log(err)
        })
    }
    return (
        <div className="text-center">
          <div className="divider w-60 mx-auto"></div>
          <button onClick={handleGoogleLogin} className="btn btn-circle btn-outline text-blue-500 text-2xl my-4">
            <FaGoogle></FaGoogle>
          </button>
        </div>
    );
};

export default SocialLogin;