import {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function checkAuthValidation(authInfo: string, type: string) {
  switch (type) {
    case 'email':
      return authInfo.includes('@');
    case 'password':
      if(authInfo.length < 7)
        return false;
      else
        return true;
    default:
      return false;
  }
}

function Auth() {
  const [isSignIn, setIsSignIn] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [authInfo, setAuthInfo] = useState({email: '', password: ''});
  const navigate = useNavigate();

  const onChangeEmailInput = (e :React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setAuthInfo((prev) => {return {...prev, email}});
  }
  const onChangePasswordInput = (e :React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setAuthInfo((prev) => {return {...prev, password}});
  }
  const onSubmitAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(isValid) {
      if(isSignIn) {
        axios.post( 'https://pre-onboarding-selection-task.shop/auth/signin', 
        { 
          email: authInfo.email,
          password: authInfo.password,
        }, 
        { 
          headers: { 
            'Content-type': 'application/json', 
          } 
        } 
      ) 
      .then((res) => {
        const data = res.data;
        localStorage.setItem('access_token',data.access_token);
        navigate('/todo');
      })
      .catch((res) => { console.log(res) })
      } else {
      axios.post( 'https://pre-onboarding-selection-task.shop/auth/signup', 
        { 
          email: authInfo.email,
          password: authInfo.password,
        }, 
        { 
          headers: { 
            'Content-type': 'application/json', 
          } 
        } 
      ) 
      .then((res) => {
        const data = res.data;
        localStorage.setItem('access_token',data.access_token);
        navigate('/todo');
      })
      .catch((res) => { console.log(res) })
      }
    } else alert("????????? ?????? ??????????????????");
  };

  useEffect(() => {
    if(localStorage.getItem('access_token'))
      {
        alert('?????? ????????? ?????? ????????????.');
        navigate('/todo');
      }
  }, [navigate])

  useEffect(() => {
    if(checkAuthValidation(authInfo.email, 'email') && checkAuthValidation(authInfo.password, 'password'))
      setIsValid(true);
    else  
      setIsValid(false);
  }, [authInfo]);
  
  return (
    <div className="h-screen w-1/3 mx-auto my-0">
      <div className="h-52 w-full mt-40 bg-gray-100 flex justify-center items-center rounded-md">
        <form onSubmit={onSubmitAuth} className="h-2/3 w-2/3 flex flex-col justify-between items-center">
          <input onChange={onChangeEmailInput} className="h-6 bg-white text-black p-2 outline-none" type="email" placeholder="email" />
          <input onChange={onChangePasswordInput} className="h-6 bg-white text-black p-2 outline-none" type="password" placeholder="password" />
          {
            isSignIn 
            ? <button type="submit" className="w-36 h-6 rounded-lg bg-lime-100 text-black">SignIn</button>
            : <button type="submit" className="w-36 h-6 rounded-lg bg-lime-100 text-black">SignUp</button>
          }
          {
            isSignIn 
            ? <button type="button" className="text-sm" onClick={()=>setIsSignIn(prev => !prev)}>??????????????????</button>
            : <button type="button" className="text-sm" onClick={()=>setIsSignIn(prev => !prev)}>???????????????</button>
          }
        </form>
      </div>
    </div>
  );
}

export default Auth;