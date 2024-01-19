import { useContext, useEffect, useState } from "react";
import { collection, onSnapshot, query, where, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../DbConnection/firebaseDb';
import logo from '../assets/moneybag.png';
import Reject from '../modals/Reject';
import Doctors from '../modals/Doctors';
import { Link } from "react-router-dom";
import { failure, success } from "../notifications/SuccessError";
import { Button, Datepicker, Dropdown } from 'flowbite-react';
import { Toast } from 'flowbite-react';
import { HiCheck } from 'react-icons/hi';
import { AppContext } from "../States/AppState";
import { Spinner } from 'flowbite-react';
import sendSms from "../mailer/sendSms";

const Incomings = () => {
    const { sending, setsending } = useContext(AppContext);
    const [patient, setPatient] = useState({});
    const [search, setsearch] = useState('');
    const [applications, setapplications] = useState([]);
    const [pdates, setDates] = useState('');
    const [fDate, setSelectedFDate] = useState(null);

    useEffect(() => {
        const q = query(collection(db, "Applications"), where("doctorId", "==", "none"));
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

    useEffect(() => {
        let q = query(collection(db, "paymentsDates"));
        onSnapshot(q, (querySnapshot) => {
            let temp = [];
            querySnapshot.forEach((doc) => {
                temp.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setDates(temp);
        });
    }, [pdates]);

    const handleDateFirst = (datef) => {
        console.log(datef.toDateString());
        setSelectedFDate(datef);
    };
    const addDate = async () => {
        if (fDate !== null && fDate !== '') {
            try {
                let selecPdate = {
                    Authorizer: "sassa finance Team",
                    Date: fDate.toDateString()
                }
                const docRef = await addDoc(collection(db, "paymentsDates"), selecPdate)
                if (docRef.id) {
                    success("Successfully added a payment date");
                    //sent sms to users
                    sendSms(fDate.toDateString());
                    setSelectedFDate(null);
                }
            } catch (error) {
                failure(String(error))
            }
        } else {
            failure("please select a date");
        }
    }

    const DeleteDate = (idToDelete) => {
        try {
            deleteDoc(doc(db, "paymentsDates", idToDelete.trim())).then(() => {
                success("Succesful removal of a paymentDate");
            }).catch(err => failure(String(err)))
        } catch (error) {
            failure(String(error));
        }
    }


    return (

        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="Dashboard p-3 bg-zinc-300 border" >
                        <div className="row p-1">
                            {
                                applications.length > 0 ?
                                    applications?.map((task) => {

                                        return (

                                            <div key={task.id} className="card mb-3" style={{ maxWidth: "340px", margin: '2px' }}>
                                                <div className="row g-0">
                                                    <div className="col-md-4">
                                                        <img src={task.profileimage.includes('https://') ? task.profileimage : logo} className="img-fluid" style={{ objectFit: 'contain', borderRadius: '100px', marginTop: '5px' }} alt="..." />
                                                        <Link to={task.filelink} target='_blank' style={{ alignSelf: 'center', marginTop: '5px',marginBottom:'5px' }} className="btn btn-outline-dark btn-sm">Document(s)</Link>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <div className="card-body">
                                                            <h5 className="card-title">{task.name}</h5>
                                                            <p className="card-text">{task.said}</p>

                                                            

                                                            <div className="dropdown">
                                                            <Dropdown color="success" label="Take action" size="sm">
                                                                    <Dropdown.Item onClick={() => setPatient(task)}  data-bs-toggle="modal" data-bs-target="#staticBackdrop" >Assign Doctor</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => setPatient(task)}  data-bs-toggle="modal" data-bs-target="#Rejection">Reject</Dropdown.Item>
                                                                 </Dropdown>
                                                                {sending && <Spinner aria-label="Default status example" />}
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

                        <Reject patient={patient} />
                        <Doctors patient={patient} />

                    </div>
                </div>

                <div className="col-lg-4 bg-slate-500">
                    <p>Payment date(s)</p>
                    <Button onClick={() => addDate()} color="light" pill>
                        add
                    </Button>
                    <div>

                        <Datepicker minDate={new Date()} required className='m-2' onSelectedDateChanged={(datef) => handleDateFirst(datef)} />
                        {fDate && (
                            <p>
                                Fisrt visit selected Date: {fDate.toDateString()}
                            </p>
                        )}

                    </div>
                    <div className="flex flex-col gap-4 m-1">
                        {pdates.length > 0 ? pdates?.map((item) => (
                            <Toast key={item.id}>
                                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                    <HiCheck className="h-5 w-5" />
                                </div>
                                <div className="ml-3 text-sm font-normal">{item.Date}.</div>
                                <Button onClick={() => DeleteDate(item.id)} size="xs" color="failure" pill>
                                    X
                                </Button>
                            </Toast>
                        )) : null}

                    </div>
                </div>

            </div>
        </div>
    );
}

export default Incomings;