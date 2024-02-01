import { Datepicker, Badge, Label, TextInput, Button, Footer } from 'flowbite-react';
import { useState } from 'react';
import { failure, success } from '../notifications/SuccessError';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../DbConnection/firebaseDb';

const AddDoctor = () => {
  const [fDate, setSelectedFDate] = useState(null);
  const [sDate, setSelectedSDate] = useState(null);
  const [upName, setName] = useState(null);
  const [upEmail, setEmail] = useState(null);
  const [upfirstD, setfirstD] = useState(null);
  const [upsecondD, setsecondD] = useState(null);
  const [upProfession, setProfession] = useState(null);
  const[upHospital,setHospital]=useState(null);

  const handleDateFirst = (datef) => {
    setfirstD(datef.toLocaleDateString('en-US'));
    setSelectedFDate(datef);
  };
  const handleDateSecond = (date) => {
    setSelectedSDate(date);
    setsecondD(date.toLocaleDateString('en-US'));
  };
  var profile = {};
  const validate = () => {
    let res = true;
    if (upName !== null && upEmail !== null && upfirstD !== null && upsecondD !== null && upProfession !== null && upHospital!==null) {
      profile = {
        Name: upName,
        Email: upEmail,
        firstD: upfirstD,
        secondD: upsecondD,
        Profession: upProfession,
        Numpatients: '0',
        maxPatient: '15',
        addrs:upHospital,
        OfficePhone: '0116541033'
      }
      res = true;
    } else {
      failure("Make sure all required fields are filled")
      setSelectedSDate(null);
      setSelectedFDate(null);
      res = false;
    }
    return res;
  }
  const SetProfile = async () => {
    if (validate()) {
      try {
        const docRef = await addDoc(collection(db, "Doctors"), profile)
      if (docRef.id) {
        success("Successfully added a doctor");
        setSelectedSDate(null);
        setSelectedFDate(null);
      }
      } catch (error) {
        failure(String(error))
      }
      
    }
    else {
      failure("Make sure all required fields are filled.");
    }

  }
  return (

    <div class="modal fade" id="adddoctor" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Add a doctor</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">X</button>
          </div>

          <div class="modal-body">

            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Name of doctor" />
              </div>
              <TextInput required onChange={(e) => setName(e.target.value)} value={upName} id="base" type="text" sizing="md" />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Email of doctor" />
              </div>
              <TextInput required
                onChange={(e) => setEmail(e.target.value)}
                value={upEmail} id="base" type="text" sizing="md" />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Profession" />
              </div>
              <TextInput required
                onChange={(e) => setProfession(e.target.value)}
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
            <Button type="button" data-bs-dismiss="modal" onClick={() => SetProfile()} color="success">add</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDoctor;