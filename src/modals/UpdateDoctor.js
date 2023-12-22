import { Datepicker ,Label, TextInput } from 'flowbite-react';
import { useState } from 'react';

const UpdateDoctor = ({Docprofile}) => {
    const {id,Name,NextavailDate,OfficePhone,Profession,Numpatients,maxPatient}=Docprofile;
    const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
    return ( 
        <div class="modal fade" id="updatedoctor" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">update doctor</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              
              <div class="modal-body">

              <div>
        <div className="mb-2 block">
          <Label htmlFor="base" value="Base input" />
        </div>
        <TextInput id="base" type="text" sizing="md" />
      </div>
                
              <div>
        <div className="mb-2 block">
          <Label htmlFor="base" value="Base input" />
        </div>
        <TextInput id="base" type="text" sizing="md" />
      </div>
      
              <Datepicker className='m-2' onSelectedDateChanged={(date)=>handleDateChange(date)}  />
              {selectedDate && (
                <p>
                  Fisrt visit selected Date: {selectedDate.toLocaleDateString('en-US')}
                </p>
              )}
              <Datepicker className='m-2' onSelectedDateChanged={(date)=>handleDateChange(date)}  />
              {selectedDate && (
                <p>
                  second visit Date: {selectedDate.toLocaleDateString('en-US')}
                </p>
              )}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success">save</button>
              </div>
            </div>
          </div>
        </div>
    );
}
 
export default UpdateDoctor;