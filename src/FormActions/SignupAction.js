import { redirect } from "react-router-dom";

export async function SignUpaction({request})
{console.log(request);
    const data=await request.formData();
    const userDetails={
        name:data.get('usurname').trim(),
        surname: data.get('uname').trim(),
        email: data.get('uemail').trim(),
        pass: data.get('upass').trim()

    }

    fetch(`http://localhost:4000/users`,
            {  
                method: "POST",
                headers:{
                    "Accept":"application/json",
                    "content-Type": "application/json"},
                body:JSON.stringify(userDetails)
            }).then(response =>
                {  
                    if(response.status===200 || response.status===201)
                    {
                        console.log("succesfull signUp");
                    }else{
                        console.log("Something went wrong: Status code - "+response.status);
                    }
                }).catch((error)=>{console.log("Something went wrong: resulting error - "+error);}
                
            );

    return redirect('/');
}