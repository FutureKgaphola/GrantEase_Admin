import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from '../DbConnection/firebaseDb';
import logo from '../assets/moneybag.png';
import Reject from '../modals/Reject';
import Doctors from '../modals/Doctors';
import { Link } from "react-router-dom";

const Incomings = () => {
    const [patient,setPatient]=useState({});
    const [search, setsearch] = useState('');
    const [applications, setapplications] = useState([]);


    useEffect(() => {
        const q = query(collection(db, "Applications"),where("doctorId", "==", "none"));
        onSnapshot(q, (querySnapshot) => {
            let temp = [];
            querySnapshot.forEach((doc) => {
                temp.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setapplications(temp);
            
        });
    }, []);


    return ( 
<div className="Dashboard p-3" >
            <div className="row p-1">
                {
                    applications.length>0 ?
                    applications?.map((task) => {
                            
                        return (

                            <div key={task.id} className="card mb-3" style={{ maxWidth: "340px",margin:'2px' }}>
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        <img src={task.profileimage.includes('https://') ? task.profileimage : logo} className="img-fluid" style={{ objectFit: 'contain', borderRadius: '100px', marginTop: '5px' }} alt="..." />
                                        <Link to={task.filelink} target='_blank' style={{ alignSelf: 'center', marginTop: '5px' }} className="btn btn-outline-dark btn-sm">Document(s)</Link>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{task.name}</h5>
                                            <p className="card-text">{task.said}</p>
                                            <div className="dropdown">
                                                <button className="btn btn-secondary dropdown-toggle btn-sm" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Take Action
                                                </button>
                                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                    <li onClick={()=>setPatient(task)}  className="dropdown-item" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Assign Doctor</li>
                                                    <li onClick={()=>setPatient(task)} className="dropdown-item" data-bs-toggle="modal" data-bs-target="#Rejection">Reject</li>
                                                </ul>
                                            </div>
                                            <p className="card-text"><small className="text-muted">Date applied : {task.applyDate}</small></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )

                    }) :
                    <p>No incomnigs found</p>  
                }
            </div>

<Reject patient={patient}/>
<Doctors patient={patient}/>

        </div>

     );
}
 
export default Incomings;