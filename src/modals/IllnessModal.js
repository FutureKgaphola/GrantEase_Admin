import { useContext, useState } from "react";
import { failure, success } from "../notifications/SuccessError";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../DbConnection/firebaseDb";
import sendEmail from "../mailer/sendEmail";
import { Button } from "flowbite-react";
import { AppContext } from "../States/AppState";

const IllnessModal = ({ patient }) => {
  const { sending, setsending } = useContext(AppContext);
    const { userId, email, name } = patient;
    const [message, Setmessage] = useState("");
    const acceptApplication=(subject)=>{
        
        if(userId!==''  && message.trim()!==''){
            setDoc(doc(db, 'users', userId.trim()), { finance: 'approved', medical: 'approved',applied:'done all good' }, { merge: true }).then(() => {
                try {
                  setsending(true);
                    sendEmail(email, name, "Your application was successful and your illness has been cornfirmed as : "+message, subject).then(()=>{
                        success('Successful');
                        setsending(false);
                    }).catch(err=>{failure(String(err));})
                } catch (error) {
                  setsending(false);
                    failure(String(error));
                }
                
            }).catch(err=>{
                failure(String(err));
            })
        }else{
            if(message.trim()==''){
                failure("Please provide illness of patient");
            }
        }
 
    }
    return ( 
        <div className="modal fade" id="illness" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">Illness</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">X</button>
          </div>
          <div className="modal-body">
            Provide medical condition confirmed by the doctor.
          </div>
          <div className="m-3">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">Confirmed Illness</label>
            <textarea required onChange={(e) => Setmessage(e.target.value)} className="form-control" id="exampleFormControlTextarea1" rows="2"></textarea>
          </div>
          <div className="modal-footer">
          <Button type="button" onClick={() => acceptApplication("GrantEase - disability grant update")} data-bs-dismiss="modal" color="dark">Save/send</Button>
          </div>
        </div>
      </div>
    </div>
     );
}
 
export default IllnessModal;