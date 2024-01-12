import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../DbConnection/firebaseDb";
export async function  ApplicationsLoader()
{
    var application = [];
    const q = query(collection(db, "Applications"));
    onSnapshot(q, (querySnapshot) => {
        application = [];
        querySnapshot.forEach((doc) => {
            application.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      });
      
    return application;
}

