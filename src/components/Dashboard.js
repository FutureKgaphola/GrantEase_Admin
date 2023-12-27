import { useContext} from 'react';
import { AppContext } from '../States/AppState';
import Incomings from './Incomings';
import Assigned from './Assigned';
import AppHeader from '../shared/AppHeader';

const Dashboard = () => {
    const {currentTab}=useContext(AppContext);
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