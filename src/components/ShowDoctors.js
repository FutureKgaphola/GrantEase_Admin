import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../DbConnection/firebaseDb";
import AddDoctor from "../modals/AddDoctor";
import UpdateDoctor from "../modals/UpdateDoctor";

const ShowDoctors = () => {

    const [Doctors, setDoctors] = useState([]);
    const[Docprofile,setDocprofile]=useState({});
    const []=useState('');
    const [res_search, setResrvSearch] = useState("");

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

    return ( 
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
                                        <td>{item.NextavailDate}</td>
                                        <td>{item.OfficePhone}</td>
                                        <td>{item.Profession}</td>
                                        <td>{item.Numpatients}</td>
                                        <td>{item.maxPatient}</td>
                                        <td>
                                            <button
                                                
                                                className="btn btn-danger">Delete</button>
                                                
                                        </td>
                                        <td>
                                            <button
                                                onClick={()=>setDocprofile(item)}
                                                className="btn btn-success" data-bs-toggle="modal" data-bs-placement="bottom" data-bs-target="#updatedoctor">Update</button>
                                                
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                    <AddDoctor/>
                    <UpdateDoctor Docprofile={Docprofile} />
        </div>
     );
}
 
export default ShowDoctors;