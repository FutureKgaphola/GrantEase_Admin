import { useContext } from "react";
import { AppContext } from "../States/AppState";

const useMailSender = async(email,name,message,subject) => {
    const { sending, setsending } = useContext(AppContext);
    try {
      setsending(true);
      const response = await fetch('https://nodemailapi-ge3d.onrender.com/sendemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email,name,message,subject })
      });

      if (!response.ok) {
        setsending(false);
        throw new Error('Network response was not ok');
        
      }
      const responseData = await response.json();
      if(responseData!==""){
        setsending(false);
      }
      
    } catch (error) {
      console.log('Error:', error);
      setsending(false);
    }

    return { sending, setsending };
}
 
export default useMailSender;