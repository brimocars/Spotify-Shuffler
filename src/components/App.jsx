import { useEffect, useState } from 'react';
import './app.module.css'
import Shuffler from './Shuffler.jsx'
import Footer from './Footer.jsx'
import { redirectToAuth, getAccessToken } from '../helpers/auth.js';


function App() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  const [accessToken, setAccessToken] = useState('');
  
  useEffect(() => {
    const getToken = async (code) => {
      const token = await getAccessToken(code)
      if (token) {
        setAccessToken(token);
      }
    }

    if (accessToken) {
      console.log(accessToken);
    } else if (!code) {
      redirectToAuth();
    } else {
      getToken(code);
    }
  }, [accessToken, code]);
  return (
    <>
      <Shuffler accessToken={accessToken}/>
      <Footer />
    </>
  )
}

export default App
