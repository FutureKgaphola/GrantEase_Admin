import { useContext} from 'react';
import { AppContext } from '../States/AppState';
import Incomings from './Incomings';
import Assigned from './Assigned';

const Dashboard = () => {
    const {currentTab}=useContext(AppContext);
    return (
        <>
        {
            currentTab==="Incoming"? <Incomings/>: <Assigned/>
        }
        </>
    );
}

export default Dashboard;