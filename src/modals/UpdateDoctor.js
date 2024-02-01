import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Datepicker,Badge, Label, TextInput, Button,Footer  } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { db } from '../DbConnection/firebaseDb';
import { failure, success } from '../notifications/SuccessError';

const UpdateDoctor = ({ Docprofile }) => {
  let { id } = Docprofile;
  const [fDate, setSelectedFDate] = useState(null);
  const [sDate, setSelectedSDate] = useState(null);
  const[upHospital,setHospital]=useState(null);
  const[upName,setName]=useState(null);
  const[upEmail,setEmail]=useState(null);
  const[upfirstD,setfirstD]=useState(null);
  const[upsecondD,setsecondD]=useState(null);
  const[upProfession,setProfession]=useState(null);
  const[upNumpatients,setNumpatients]=useState(null);
  const[upmaxPatient,setmaxPatient]=useState(null);

  useEffect(() => {
    if(id!==undefined && id!==""){
      const colRef = doc(db, "Doctors", id);
    onSnapshot(colRef, (snapshot) => {
        try {
          //setupdate(snapshot.data());
          setName(snapshot.data()?.Name.trim());
          setEmail(snapshot.data()?.Email.trim());
          setfirstD(snapshot.data()?.firstD.trim());
          setsecondD(snapshot.data()?.secondD.trim());
          setProfession(snapshot.data()?.Profession.trim());
          setNumpatients(snapshot.data()?.Numpatients.trim());
          setmaxPatient(snapshot.data()?.maxPatient.trim());
          setHospital(snapshot.data()?.addrs.trim())

        } catch (error) {
            failure(String(error));
        }
    });
    }

},[id]);

  const handleDateFirst = (datef) => {
    setfirstD(datef.toLocaleDateString('en-US'));
    setSelectedFDate(datef);
    //setupdate({firstD:datef.toLocaleDateString('en-US')});
  };
  const handleDateSecond = (date) => {
    //setupdate({secondD:date.toLocaleDateString('en-US')});
    setSelectedSDate(date);
    setsecondD(date.toLocaleDateString('en-US'));
  };
  var update={};
  const validate=()=>{
    let res=true;
    if(upName!=="" || upEmail!=="" || upfirstD!=="" || upsecondD!=="" || upProfession!==""|| upNumpatients!=="" || upmaxPatient!=="" || upHospital!==""){
      update={
        Name:upName,
        Email:upEmail,
        firstD:upfirstD,
        secondD:upsecondD,
        Profession:upProfession,
        Numpatients:upNumpatients,
        addrs:upHospital,
        maxPatient:upmaxPatient
      }
      res= true; 
    }else{
      failure("Make sure all required fields are filled")
      setSelectedSDate(null);
        setSelectedFDate(null);
      res= false;
    }
    return res; 
  }
  const updateProfile=()=>{
    if(validate()){
      setDoc(doc(db, 'Doctors', id.trim()), update, { merge: true }).then(()=>{
        success("Successful update");
        setSelectedSDate(null);
        setSelectedFDate(null);
      }).catch(err=>{
        failure(String(err))
      })
    }
  }

  return (
    <div class="modal fade" id="updatedoctor" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">update doctor</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">X</button>
          </div>

          <div class="modal-body">

            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Name of doctor" />
              </div>
              <TextInput onChange={(e)=>setName(e.target.value)} value={upName} id="base" type="text" sizing="md" />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Email of doctor" />
              </div>
              <TextInput
              onChange={(e)=>setEmail(e.target.value)}
              value={upEmail} id="base" type="text" sizing="md" />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Profession" />
              </div>
              <TextInput
              onChange={(e)=>setProfession(e.target.value)}
              value={upProfession} id="base" type="text" sizing="md" />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Hospital" />
              </div>
              <TextInput required
                onChange={(e) => setHospital(e.target.value)}
                value={upHospital} id="base" type="text" sizing="md" />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Max Patients" />
              </div>
              <TextInput
              onChange={(e)=>setmaxPatient(e.target.value)}
              value={upmaxPatient} id="base" type="number" required sizing="md" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Number of patients" />
              </div>

              <TextInput
              onChange={(e)=>setNumpatients(e.target.value)}
              value={upNumpatients} id="base" type="number" required sizing="md" />
            </div>
            <Footer.Divider />
            <div className='flex flex-row flex-wrap gap-2'>
            <Badge color="gray">"Current Fisrt visit Date:"{upfirstD}</Badge>
            <Badge color="gray">"Current Second visit Date:"{upsecondD}</Badge>
            </div>
            <Datepicker minDate={new Date()} required className='m-2' onSelectedDateChanged={(datef) => handleDateFirst(datef)} />
            {fDate && (
              <p>
                Fisrt visit selected Date: {fDate.toLocaleDateString('en-US')}
              </p>
            )}
            <Datepicker minDate={new Date()} required className='m-2' onSelectedDateChanged={(date) => handleDateSecond(date)} />
            {sDate && (
              <p>
                Second visit Date: {sDate.toLocaleDateString('en-US')}
              </p>
            )}
          </div>
          <div class="modal-footer">
            <Button type="button" data-bs-dismiss="modal" color="dark">Close</Button>
            <Button type="button" data-bs-dismiss="modal" onClick={()=>updateProfile()} color="success">Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateDoctor;