import { useContext, useEffect} from 'react';
import { AppContext } from '../States/AppState';
import Incomings from './Incomings';
import Assigned from './Assigned';
import AppHeader from '../shared/AppHeader';
import { useNavigate } from 'react-router-dom';
import { failure } from '../notifications/SuccessError';

const Dashboard = () => {
    const {currentTab}=useContext(AppContext);
    const navigate = useNavigate();
    useEffect(()=>{
        try {
            if(sessionStorage.getItem("id")===""){
                navigate('/');
              }
        } catch (error) {
            failure(String(error));
            navigate('/');
        }
      },[]);
    return (
        <>
        <AppHeader/>
        {
            currentTab==="Incoming"? <Incomings/>: <Assigned/>
        }
        </>
    );
}

export default Dashboard;