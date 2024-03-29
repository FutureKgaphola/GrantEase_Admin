const sendEmail =async(email,name,message,subject)=>{
    try {
      const response = await fetch('https://nodemailapi-ge3d.onrender.com/sendemail', {
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
      
    } catch (error) {
      console.log('Error:', error);
      //console.log(email+"-"+name+"-"+message+"-"+subject);
    }
  }

  export default sendEmail;