import { useNavigate } from "react-router-dom";
import logo from '../assets/moneybag.png';
import { HiMail } from 'react-icons/hi';
import { useEffect, useState } from "react";
import { failure, success } from "../notifications/SuccessError";
import { Button, Label, TextInput } from "flowbite-react";
import { HiUser } from 'react-icons/hi';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../DbConnection/firebaseDb";

const Login = () => {
  
  const navigate = useNavigate();
  var [email, setEmail] = useState('');
  var [pass, setpassword] = useState('');
  var [erroremail, seterroremail] = useState(false);
  var [errorpass, seterrorpass] = useState(false);
  
  useEffect(()=>{
    if(sessionStorage.getItem("id")!==""){
      navigate('/dashboard');
    }
  },[]);
  const handleSubmit = async (event) => {
    event.preventDefault();

    var re = /\S+@\S+\.\S+/;
    if (email.trim().length < 1 || re.test(email.trim()) === false) {
      seterroremail(true);
    } else {
      seterroremail(false);

    }
    if (pass.trim().length < 1) {
      seterrorpass(true);
    } else { seterrorpass(false) }

    if (erroremail === false && errorpass === false) {

      try {
        if(email.trim().toLocaleLowerCase()==="admin@grantease.co.za"){
          let res = await signInWithEmailAndPassword(auth, email.trim().toLocaleLowerCase(), pass);
      if (res.user?.uid) {
        sessionStorage.setItem("id", res.user.uid);
        success("welcome adminstrator");
        setpassword('');
        navigate('/dashboard');
      }
        }else{
          failure("User Name violation: The username provided is not granted on this system");
        }
      } catch (error) {
        failure(String(error));
      }
    }

  };

  return (

    <section className="vh-100 bg-slate-300">
      <div className="container py-5 h-100">

        <div className="row d-flex justify-content-center align-items-center h-100 gap-0 p-0">
          <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4 m-0 bg-white border py-3 rounded-md z-10 shadow-md">
            <img src={logo} alt="" className="w-11 h-11 object-contain self-center" />
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1" value="Administrator email" />
              </div>
              <TextInput onChange={(e) => setEmail(e.target.value)} value={email} icon={HiMail} id="email1" type="email" placeholder="user@domain.com" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password1" value="Your password" />
              </div>
              <TextInput onChange={(e) => setpassword(e.target.value)} value={pass} id="password1" type="password" required />
            </div>

            <Button color="success" type="submit">
              <HiUser className="mr-2 h-5 w-5" />
              login</Button>
            {erroremail && <p style={{ color: 'red' }}>Please input a valid email.</p>}
            {errorpass && <p style={{ color: 'red' }}>Please input a valid pasword length of more charecters.</p>}

          </form>

        </div>
      </div>
    </section>
  );
}

export default Login;