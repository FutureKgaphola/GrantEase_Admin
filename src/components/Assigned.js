import { useContext, useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { db, storage } from '../DbConnection/firebaseDb';
import Reject from '../modals/Reject';
import { HiCloudDownload } from 'react-icons/hi';
import { Link } from "react-router-dom";
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { failure, success } from "../notifications/SuccessError";
import { Dropdown, Button, Modal, ListGroup, Datepicker } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import IllnessModal from "../modals/IllnessModal";
import { Toast } from 'flowbite-react';
import { HiCheck } from 'react-icons/hi';
import { AppContext } from "../States/AppState";
import { Spinner } from 'flowbite-react';
const Assigned = () => {
    const { sending, setsending } = useContext(AppContext);
    const [openModal, setOpenModal] = useState(false);
    const [patient, setPatient] = useState({});
    const [pdates, setDates] = useState('');
    const [applications, setapplications] = useState([]);
    var [fileupload, setfileupload] = useState(null);
    const [patientId, setpatientId] = useState('');
    const [fDate, setSelectedFDate] = useState(null);

    useEffect(() => {
        let q = query(collection(db, "Applications"), where("doctorId", "!=", "none"));
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


    const SaveRecord = (applicationId, userId) => {

        try {
            if (fileupload == null) return;
            var filename = fileupload.name + v4();
            var filepath = `Applications/${filename}`;
            let pdfRef = ref(storage, filepath);
            uploadBytes(pdfRef, fileupload).then(() => {
                getDownloadURL(ref(storage, filepath)).then((url) => {
                    setDoc(doc(db, 'Applications', applicationId.trim()), { medReport: url, medReportName: filename }, { merge: true }).then(() => {
                        fileupload = null;
                        //update user profile
                        setDoc(doc(db, 'users', userId.trim()), { medcertificate: url, medical: 'approved', applied: 'final application processing' }, { merge: true });
                        //find apointment and delete it
                        const q = query(collection(db, "Apointments"), where("patientId", "==", userId.trim()));
                        onSnapshot(q, (querySnapshot) => {
                            querySnapshot.forEach((docs) => {
                                deleteDoc(doc(db, "Apointments", docs.id.trim()))
                            })
                        })
                        success("added medical report");
                    });
                }).catch((err) => { failure(String(err)) })
            }).catch((err) => { failure(String(err)) })

        } catch (error) {
            fileupload = null;
            console.log(error);
        }
    }
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
                            {sending && <Spinner aria-label="approving request..."  size="md"/> }
                            {
                                applications.length > 0 ? applications
                                    .map((task) => {

                                        return (

                                            <div key={task.id} className="card mb-3" style={{ maxWidth: "340px", margin: '2px' }}>
                                                <div className="row g-0">
                                                    <div className="col">
                                                        <Button color="success" data-bs-placement="bottom" style={{ margin: "5px" }}
                                                            type="button"
                                                            className="btn btn-success"
                                                        ><i className="fa fa-address-book" aria-hidden="true"></i></Button>
                                                        <hr className="dropdown-divider"></hr>
                                                        <p>Client details</p>
                                                        <Link to={task.filelink} target='_blank' style={{ alignSelf: 'center', margin: '5px' }} className="btn btn-outline-dark btn-sm">ext Document(s)</Link>
                                                        {
                                                            task.medReport.includes('http') ? <Link to={task.medReport} target='_blank' style={{ alignSelf: 'center', margin: '5px' }} className="btn btn-outline-dark btn-sm">int Document(s)</Link> : null
                                                        }
                                                        <ListGroup className="w-48">
                                                            {task.Hrfile.map((item, index) => (

                                                                index == 0 ? <Link key={index} target='_blank' to={item}><ListGroup.Item icon={HiCloudDownload}>ID</ListGroup.Item></Link>
                                                                    : index == 1 ? <Link key={index} target='_blank' to={item}><ListGroup.Item icon={HiCloudDownload}>Proof of Resident</ListGroup.Item></Link>
                                                                        : <Link key={index} target='_blank' to={item}><ListGroup.Item icon={HiCloudDownload}>Application form</ListGroup.Item></Link>
                                                            ))}

                                                        </ListGroup>
                                                        <div className="mb-3">
                                                            <label htmlFor="formFile" className="form-label">{task.Hrfile.includes('http') ? 'Update medical report' : 'Attach medical report'}</label>
                                                            <input accept="application/pdf" onChange={(event) => setfileupload(event.target.files[0])} className="form-control" type="file" id="formFile" />
                                                        </div>
                                                        <div className="card-body">
                                                            <h5 className="card-title">{task.name}</h5>
                                                            <p className="card-text">{task.said}</p>
                                                            <p className="card-text">{"Doctor assigned: " + task.doctorName}</p>
                                                            <div className="dropdown">

                                                                <Dropdown color="success" label="Take action" size="sm">
                                                                    <Dropdown.Item onClick={() => {
                                                                        setOpenModal(true);
                                                                        setpatientId(task);
                                                                    }} >Approve for payment dates</Dropdown.Item>
                                                                    <Dropdown.Item data-bs-toggle="modal" data-bs-target="#Rejection" onClick={() => setPatient(task)}>Reject</Dropdown.Item>
                                                                    <Dropdown.Item><Button color="success" onClick={() => SaveRecord(task.id, task.userId)} size="xs">{task.medReport.includes('http') ? "Update" : "Save"}</Button></Dropdown.Item>
                                                                </Dropdown>
                                                                
                                                                
                                                            </div>
                                                            <p className="card-text"><small className="text-muted">Date applied : {task.applyDate}</small></p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        )

                                    }) : <p>No Assigned found</p>
                            }
                        </div>
                        <Reject patient={patient} />
                        <IllnessModal patient={patientId} />
                        <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                            <Modal.Header />
                            <Modal.Body>
                                <div className="text-center">
                                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                        Are you sure you want financially approve this person?
                                    </h3>
                                    <div className="flex justify-center gap-4">
                                        <Button data-bs-toggle="modal" data-bs-target="#illness" color="success" onClick={() => setOpenModal(false)} >
                                            {"Yes, I'm sure"}
                                        </Button>
                                        <Button color="gray" onClick={() => setOpenModal(false)}>
                                            No, cancel
                                        </Button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
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


export default Assigned;