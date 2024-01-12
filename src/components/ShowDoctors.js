import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../DbConnection/firebaseDb";
import AddDoctor from "../modals/AddDoctor";
import UpdateDoctor from "../modals/UpdateDoctor";
import AppHeader from "../shared/AppHeader";
import { Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import sendEmail from "../mailer/sendEmail";
import { failure, success } from "../notifications/SuccessError";
import { useNavigate } from "react-router-dom";

const ShowDoctors = () => {
    const [openModal, setOpenModal] = useState(false);
    const [Doctors, setDoctors] = useState([]);
    const [Docprofile, setDocprofile] = useState({});
    const [res_search, setResrvSearch] = useState("");
    const [doctorId, setDoctorId] = useState("");
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
    useEffect(() => {
        const q = query(collection(db, "Doctors"));
        onSnapshot(q, (querySnapshot) => {
            let temp = [];
            querySnapshot.forEach((doc) => {
                temp.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setDoctors(temp);
        });
    }, []);

    let appintmentTable = 0;
    let aplicationsTable = 0;
    let DoctorsTable = 0;
    const deleteDoctor = (doctor_Id) => {
        setDoctorId(doctor_Id);
        setOpenModal(true);
    }
    const ImSure = () => {
        //search tables where he exsit n remove 
        //notify users if already has been assigned to him/her then delete data, request then to re-apply
        if (doctorId !== "") {
            const q1 = query(collection(db, "Apointments"), where("doctorId", "==", doctorId.trim()));
            onSnapshot(q1, (querySnapshot) => {
                querySnapshot.forEach((docs) => {
                    deleteDoc(doc(db, "Apointments", docs.id.trim()));
                })
            });

            const q2 = query(collection(db, "Applications"), where("doctorId", "==", doctorId.trim()));
            onSnapshot(q2, (querySnapshot) => {
                querySnapshot.forEach((docs) => {
                    if (docs.data().Hrfile.includes("http") === false) {
                        sendEmail(docs.data().email, "Dear Applicant", "We hope this main finds you well, kindly note your application has been removed from our system. we request you re-apply again if you are not yet receiving your funding.", "Application Cancellation Due to doctor's dismissal")
                        const update = {
                            applied: 'no application',
                            medical: "not approved",
                            applicationId: '',
                            illness: 'not applicable',
                            medcertificate: 'not applicable',
                        }
                        setDoc(doc(db, 'users', docs.data().userId.trim()), update, { merge: true }).then(() => {
                            deleteDoc(doc(db, "Applications", docs.id.trim()));
                        }).catch(err => failure(String(err)))
                    }
                })
            });
            try {
                deleteDoc(doc(db, "Doctors", doctorId.trim())).then(() => {
                    success("Succesful removal of a doctor");
                    setOpenModal(false)
                }).catch(err => failure(String(err)))
            } catch (error) {
                failure(String(error));
            }

        } else {
            failure("Could not get Doctor Id to perform query with. try refreshing the web page");
        }
    }

    return (
        <>
            <AppHeader />
            <div className="container-fluid">
                <table className="table table-dark table-hover table-responsive">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Avail Date</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Profession</th>
                            <th scope="col">No. Patients</th>
                            <th scope="col">Max Patient</th>
                            <th scope="col">.</th>
                            <th scope="col"><button data-bs-toggle="modal" data-bs-placement="bottom" title="add doctors" data-bs-target="#adddoctor" style={{ margin: "2px" }}
                                type="button"
                                className="btn btn-success"
                            ><i class="fa fa-user-plus" aria-hidden="true"></i></button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Doctors.filter((value) => {
                                return res_search.toLowerCase() === '' ? value : value.Name.toLowerCase().includes(res_search);
                            }).map((item) => (
                                <tr key={item.id}>
                                    <th scope="row">{item.Name}</th>
                                    <td>{item.Email}</td>
                                    <td>{item.firstD} & {item.secondD}</td>
                                    <td>{item.OfficePhone}</td>
                                    <td>{item.Profession}</td>
                                    <td>{item.Numpatients}</td>
                                    <td>{item.maxPatient}</td>
                                    <td>
                                        <button
                                            onClick={() => deleteDoctor(item.id)}
                                            className="btn btn-danger">Delete</button>

                                    </td>
                                    <td>
                                        <button
                                            onClick={() => setDocprofile(item)}
                                            className="btn btn-success" data-bs-toggle="modal" data-bs-placement="bottom" data-bs-target="#updatedoctor">Update</button>

                                    </td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
                <AddDoctor />
                <UpdateDoctor Docprofile={Docprofile} />
            </div>
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this Doctor?
                        </h3>
                        <p>Doctor may have appointments and or linked to some applications. as such all will be deleted or de-associated with.</p>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => ImSure()}>
                                {"Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>

    );
}

export default ShowDoctors;