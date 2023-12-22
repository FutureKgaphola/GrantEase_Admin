const sendEmail =async(email,name,message,subject)=>{
    try {
      const response = await fetch('http://localhost:4000/sendemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email,name,message,subject })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      console.log(responseData);
      
    } catch (error) {
      console.log('Error:', error);
    }
  }

  export default sendEmail;