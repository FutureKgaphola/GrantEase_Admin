import { addDoc, collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import { db } from "../DbConnection/firebaseDb";
import { useEffect, useState } from "react";
import { failure, success } from "../notifications/SuccessError";

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
        let {Numpatients,maxPatient,NextavailDate,id,Name,Profession}=item;
        let value=parseInt(Numpatients)+1;
        const update={
            Numpatients:String(value)
        }
        if(parseInt(Numpatients)<parseInt(maxPatient)){
            setDoc(doc(db, 'Doctors', id.trim()), update, { merge: true }).then(()=>{
                const data={
                    bin:'no_',
                    dateapoint:NextavailDate,
                    doctor:Name,
                    doctorId:id,
                    doctorImage:'none',
                    iscancelled:'no',
                    patientId:userId,
                    patientName:name,
                    resheduleStatus:'not set',
                    sheduleRequestDate:'none',
                    specialization:Profession,
                    timebooked:'15:h45'
                }
                addDoc(collection(db, 'Apointments'),data).then(resp=>{
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
                                        <p className="card-text">Next availability date {item.NextavailDate}</p>
                                        <button onClick={() => assignClient(item)} type="button" className="btn btn-light" data-bs-dismiss="modal">assign</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Doctors;