import { addDoc, collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import { db } from "../DbConnection/firebaseDb";
import { useEffect, useState } from "react";
import { failure, success } from "../notifications/SuccessError";
import { Button } from "flowbite-react";

const Doctors = ({patient}) => {
    const {userId,name}= patient;
    const applicationId=patient.id;
    const [Doctors, setDoctors] = useState([]);

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

    const assignClient=(item)=>{
        let {Numpatients,maxPatient,firstD,id,Name,Profession}=item;
        
        let value=parseInt(Numpatients)+1;
        const update={
            Numpatients:String(value)
        }
        if(parseInt(Numpatients)<parseInt(maxPatient)){
            setDoc(doc(db, 'Doctors', id.trim()), update, { merge: true }).then(()=>{
                const data={
                    bin:'no_',
                    dateapoint:firstD,
                    doctor:Name,
                    doctorId:id,
                    doctorImage:'none',
                    iscancelled:'no',
                    patientId:userId,
                    patientName:name,
                    resheduleStatus:'not set',
                    sheduleRequestDate:'none',
                    specialization:Profession,
                    timebooked:'08H00',
                }
                //console.log(data);
                addDoc(collection(db, 'Apointments'),data).then(resp=>{
                    //console.log('data sent');
                    //console.log(data);
                    setDoc(doc(db, 'Applications', applicationId.trim()), {doctorId:id,doctorName:Name}, { merge: true });
                    success("Assigned a patient to a doctor");
                }).catch(err=>{console.log(String(err))});
            }).catch(err=>{console.log(String(err))});
        }else{
            failure("Doctor has reached their limit for patient to treat. you may update the limit on this doctor's profile");
        }
    }

    return (
        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Doctors</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">X</button>
                    </div>
                    <div className="modal-body">
                        {
                            Doctors?.map((item) => (
                                <div key={item.id} className="card text-white bg-secondary mb-3" style={{ maxWidth: '100rem' }}>
                                    <div className="card-header">Neurologist</div>
                                    <div className="card-body">
                                        <h5 className="card-title">Dr {item.Name}</h5>
                                        <p className="card-text">Current no. of patients : {item.Numpatients}/{item.maxPatient}</p>
                                        <p className="card-text">Date availabile {item.firstD}</p>
                                        <Button color="light" onClick={() => assignClient(item)} type="button" data-bs-dismiss="modal">assign</Button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="modal-footer">
                        <Button color="dark" type="button" data-bs-dismiss="modal">Close</Button>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Doctors;