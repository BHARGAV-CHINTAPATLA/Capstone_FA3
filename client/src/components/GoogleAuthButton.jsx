import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { googleAuth } from '../api';
import { useAuth } from '../hooks/useAuth';

const GoogleAuthButton = ({ onError }) => {
  const { login } = useAuth();
  const navigate = useNavigate();


  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      onError('Google did not return a credential. Please try again.');
      return;
    }

    try {
      const response = await googleAuth(credentialResponse.credential);
      login(response.data.token);
      navigate('/dashboard');
    } catch (error) {
      onError(error.response?.data?.error || 'Google authentication failed. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError('Google authentication failed. Please try again.')}
        useOneTap={false}
        width="340"
      />
    </div>
  );
};

export default GoogleAuthButton;
