import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { db, storage } from '../DbConnection/firebaseDb';
import Reject from '../modals/Reject';
import Doctors from '../modals/Doctors';
import { Link } from "react-router-dom";
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { failure, success } from "../notifications/SuccessError";
import { Dropdown,Button,Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
const Assigned = () => {
    const [openModal, setOpenModal] = useState(false);
    const [patient, setPatient] = useState({});
    const [search, setsearch] = useState('');
    const [applications, setapplications] = useState([]);
    var [fileupload, setfileupload] = useState(null);

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

    const SaveRecord = (applicationId,userId) => {

        try {
            if (fileupload == null) return;
            var filename = fileupload.name + v4();
            var filepath = `Applications/${filename}`;
            let pdfRef = ref(storage, filepath);
            uploadBytes(pdfRef, fileupload).then(() => {
                getDownloadURL(ref(storage, filepath)).then((url) => {
                    setDoc(doc(db, 'Applications', applicationId.trim()), { Hrfile: url, HrfileName: filename }, { merge: true }).then(() => {
                        fileupload = null;
                        //update user profile
                        setDoc(doc(db, 'users', userId.trim()), { medcertificate: url, medical:'approved',applied :'final application processing'  }, { merge: true });
                        //find apointment and delete it
                        const q = query(collection(db, "Apointments"), where("patientId", "==", userId.trim()));
                        onSnapshot(q, (querySnapshot) => {
                        querySnapshot.forEach((docs) => {
                            deleteDoc(doc(db, "Apointments", docs.id.trim()))
                        })
                        })
                        success("added medical report");
                    });
                }).catch((err)=>{failure(String(err))})
            }).catch((err)=>{failure(String(err))})
            
        } catch (error) {
            fileupload = null;
            console.log(error);
        }
    }
    return (
        <div className="Dashboard p-3" >
            <div className="row p-1">
                {
                    applications.length>0 ? applications
                    .map((task) => {

                        return (

                            <div key={task.id} className="card mb-3" style={{ maxWidth: "340px", margin: '2px' }}>
                                <div className="row g-0">
                                    <div className="col">
                                        <Button  color="success" data-bs-placement="bottom" style={{ margin: "5px" }}
                                            type="button"
                                            className="btn btn-success"
                                        ><i class="fa fa-address-book" aria-hidden="true"></i></Button>
                                        <hr class="dropdown-divider"></hr>
                                        <p>Client details</p>
                                        <Link to={task.filelink} target='_blank' style={{ alignSelf: 'center', margin: '5px' }} className="btn btn-outline-dark btn-sm">ext Document(s)</Link>
                                        {
                                            task.Hrfile.includes('http') ? <Link to={task.Hrfile} target='_blank' style={{ alignSelf: 'center', margin: '5px' }} className="btn btn-outline-dark btn-sm">int Document(s)</Link> : null
                                        }
                                        <div className="mb-3">
                                            <label htmlFor="formFile" className="form-label">{task.Hrfile.includes('http') ? 'Update medical report' : 'Attach medical report'}</label>
                                            <input accept="application/pdf" onChange={(event) => setfileupload(event.target.files[0])} className="form-control" type="file" id="formFile" />
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">{task.name}</h5>
                                            <p className="card-text">{task.said}</p>
                                            <p className="card-text">{"Doctor assigned: " + task.doctorName}</p>
                                            <div className="dropdown">
                                                
                                                <Dropdown  color="success" label="Take action" size="sm">
                                                    <Dropdown.Item onClick={() => setOpenModal(true)} >finacially approve</Dropdown.Item>
                                                    <Dropdown.Item data-bs-toggle="modal" data-bs-target="#Rejection" onClick={() => setPatient(task)}>Reject</Dropdown.Item>
                                                    <Dropdown.Item><Button  color="success" onClick={() => SaveRecord(task.id,task.userId)} size="xs">{task.Hrfile.includes('http') ? "Update" : "Save"}</Button></Dropdown.Item>
                                                </Dropdown>
                                                
                                            </div>
                                            <p className="card-text"><small className="text-muted">Date applied : {task.applyDate}</small></p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )

                    }): <p>No Assigned found</p>

                }
            </div>
            <Reject patient={patient} />
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want financially approve this person?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="success" onClick={() => setOpenModal(false)}>
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
    );
}

export default Assigned;