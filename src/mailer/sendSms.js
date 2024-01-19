const sendSms =async(paydate)=>{
    try {
      const response = await fetch('https://nodemailapi-ge3d.onrender.com/sendsms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({paydate})
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      
    } catch (error) {
      console.log('Error:', error);
    }
  }

  export default sendSms;