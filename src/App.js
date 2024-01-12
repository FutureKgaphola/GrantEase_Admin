
import './App.css';
import {Route, createBrowserRouter,createRoutesFromElements, RouterProvider} from 'react-router-dom';
import ParentLayout from './Layouts/ParentLayout';
import Comp404 from './components/Comp404';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ShowDoctors from './components/ShowDoctors';
import { AppProvider } from './States/AppState';
import Feeds from './components/Feeds';

const router= createBrowserRouter(
  createRoutesFromElements(
      <Route path='/' element={<ParentLayout/>}>
          <Route path='/'  element={<Login/>}/>
          <Route path='dashboard' element={<Dashboard/>}/>
          <Route path='ShowDoctors' element={<ShowDoctors/>}/>
          <Route path='Feeds' element={<Feeds/>}/>
          <Route path='*' element={<Comp404/>}/>
      </Route>
  )
)

function App() {
  return (
    <AppProvider>
<RouterProvider router={router}/>
    </AppProvider>
    
  );
}

export default App;
