import { getStorage, ref, deleteObject } from "firebase/storage";
import { db } from "../DbConnection/firebaseDb";
import { doc, setDoc, deleteDoc, query, collection, where, onSnapshot } from "firebase/firestore";
import sendEmail from "../mailer/sendEmail";
import { useState } from "react";
import { Modal } from "antd";
import { Button } from "flowbite-react";

const Reject = ({ patient }) => {
  const [message, Setmessage] = useState("");
  const { userId, fileName, HrfileName, id, email, name } = patient;
  const storage = getStorage();

  function success() {
    const modal = Modal.success({
      title: "Success notification",
      content: "Rejected with email succesful",
    });
    setTimeout(() => modal.destroy(), 5000);
  }
  function failure(message) {
    const modal = Modal.error({
      title: "Failure notification",
      content: message,
    });
    setTimeout(() => modal.destroy(), 5000);
  }

  const desertRef = ref(storage, `Applications/${fileName}`);

  const deleteApplication = (subject) => {
    if (message.trim() !== '') {
      const HRRef = ref(storage, `Applications/${HrfileName}`);
      if (HrfileName !== "no file name" && HrfileName.includes('.pdf')) {
        deleteObject(HRRef);
      }
      deleteObject(desertRef).then(() => {
        const update = {
          applied: 'no application',
          medical:"not approved",
          applicationId:'',
          illness: 'not applicable',
          medcertificate: 'not applicable',
                              
        }
        setDoc(doc(db, 'users', userId.trim()), update, { merge: true }).then(() => {
          deleteDoc(doc(db, "Applications", id.trim())).then(() => {
            //find apointment and delete it
            const q = query(collection(db, "Apointments"), where("patientId", "==", userId.trim()));
            onSnapshot(q, (querySnapshot) => {
              querySnapshot.forEach((docs) => {
                deleteDoc(doc(db, "Apointments", docs.id.trim()))
              })
            })

            try {
              sendEmail(email, name, message, subject).then(() => {
                success();
              }).catch(err => {
                failure(String(err));
              });
            } catch (error) {
              failure(String(error));
            }
          })
        }).catch((error) => {
          console.log(error);
        })
      }).catch((error) => {
        console.log(error);
      })
    } else {
      failure("no message addeded. provide rejection email");
    }
  }
  return (
    <div className="modal fade" id="Rejection" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">Rejection</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">X</button>
          </div>
          <div className="modal-body">
            You are about to reject this application record. this action will delete this application.
          </div>
          <div className="m-3">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">Rejection message</label>
            <textarea required onChange={(e) => Setmessage(e.target.value)} className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
          </div>
          <div className="modal-footer">
            <Button color="dark" type="button" onClick={() => deleteApplication("GrantEase - disability grant update")} data-bs-dismiss="modal">Yes, reject</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reject;