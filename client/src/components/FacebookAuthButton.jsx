import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { facebookAuth } from '../api';
import { useAuth } from '../hooks/useAuth';

const FACEBOOK_SDK_ID = 'facebook-jssdk';

const FacebookAuthButton = ({ onError }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [sdkReady, setSdkReady] = useState(false);
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID;

  useEffect(() => {
    if (!appId) return undefined;

    window.fbAsyncInit = () => {
      window.FB.init({
        appId,
        cookie: true,
        xfbml: false,
        version: 'v24.0'
      });
      setSdkReady(true);
    };

    if (document.getElementById(FACEBOOK_SDK_ID)) {
      if (window.FB) setSdkReady(true);
      return undefined;
    }

    const script = document.createElement('script');
    script.id = FACEBOOK_SDK_ID;
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    document.body.appendChild(script);

    return () => {
      window.fbAsyncInit = undefined;
    };
  }, [appId]);



  const handleLogin = () => {
    if (!sdkReady || !window.FB) {
      onError('Facebook is still loading. Please try again.');
      return;
    }

    window.FB.login(async (response) => {
      if (!response.authResponse?.accessToken) {
        onError('Facebook authentication was cancelled or failed.');
        return;
      }

      try {
        const result = await facebookAuth(response.authResponse.accessToken);
        login(result.data.token);
        navigate('/dashboard');
      } catch (error) {
        onError(error.response?.data?.error || 'Facebook authentication failed. Please try again.');
      }
    }, { scope: 'email' });
  };

  return (
    <button
      type="button"
      className="btn w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
      onClick={handleLogin}
      disabled={!sdkReady}
      style={{ background: '#1877f2', color: '#fff', border: 'none', borderRadius: 8 }}
    >
      <i className="bi bi-facebook" aria-hidden="true"></i>
      {sdkReady ? 'Continue with Facebook' : 'Loading Facebook...'}
    </button>
  );
};

export default FacebookAuthButton;
