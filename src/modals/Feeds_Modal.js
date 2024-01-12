import { Button, Label, TextInput, Textarea, FileInput } from "flowbite-react";
import { useState } from "react";
import { failure, success } from "../notifications/SuccessError";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../DbConnection/firebaseDb";
import { addDoc, collection } from "firebase/firestore";

const Feeds_Modal = () => {
  const [title, setTitle] = useState(null);
  const [PageUri, setPageUri] = useState(null);
  const [Message, setMessage] = useState(null);
  const [imageupload, setimageupload] = useState(null);

  const uploadFeed=()=>{
    if (imageupload == null) {
      failure("make sure all required fields are meet")
      return;
    }else{
      if(title!==null && PageUri!==null && Message!==null){
        if(PageUri.includes('http')===false){
          failure("make sure all required fields are meet")
          return;
        }else{
          var filename = imageupload.name + v4();
          var filepath = `Feeds/${filename}`;
          const imageRef = ref(storage, filepath);
          uploadBytes(imageRef, imageupload).then(()=>{
            getDownloadURL(ref(storage, filepath)).then(async(url)=>{
              let feedsData={}
              feedsData={
                msg:Message,
                title:title,
                tumbnail:url,
                url:PageUri
              }
              try {
                const docRef = await addDoc(collection(db, "Feeds"), feedsData)
              if (docRef.id) {
                success("Successfully added a Feed");
                setTitle(null);
                setPageUri(null);
                setMessage(null);
                setimageupload(null);
              }
              //success("Successfully added a Feed");
                
              } catch (error) {
                failure(String(error))
              }
            })
          })
        }
      }else{
        failure("make sure all required fields are meet")
      }
    }
        
  }
  return (
    <div class="modal fade" id="FeedsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Add a Feed</h5>

            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">X</button>
          </div>

          <div class="modal-body">

            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Title" />
              </div>
              <TextInput required onChange={(e) => setTitle(e.target.value)} value={title} id="base" type="text" sizing="md" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Page Uri" />
              </div>
              <TextInput placeholder="https://" required onChange={(e) => setPageUri(e.target.value)} value={PageUri} id="base" type="text" sizing="md" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Page Uri" />
              </div>
              <Textarea onChange={(e) => setMessage(e.target.value)} value={Message} placeholder="Leave a comment..." required rows={4} id="base" type="text" sizing="md" />
            </div>
            <div id="fileUpload" className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="file" value="Upload file" />
              </div>
              <FileInput  accept="image/png, image/jpg, image/jpeg" onChange={(event) => setimageupload(event.target.files[0])} id="file" helperText="Select an image to use as a thumbnail or preview" />
            </div>
          </div>
          <div class="modal-footer">
            <Button type="button" data-bs-dismiss="modal" color="dark">close</Button>
            <Button onClick={()=>uploadFeed()} type="button" data-bs-dismiss="modal" color="success">add</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feeds_Modal;