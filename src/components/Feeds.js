import AppHeader from "../shared/AppHeader";
import { Button, Card, Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle, HiNewspaper } from 'react-icons/hi';
import FeedsModal from "../modals/Feeds_Modal";
import { collection, deleteDoc, doc, onSnapshot, query } from "firebase/firestore";
import { db } from "../DbConnection/firebaseDb";
import { failure, success } from "../notifications/SuccessError";
import { useNavigate } from "react-router-dom";

const Feeds = () => {
  const [openModal, setOpenModal] = useState(false);
  const [Feeds, setFeeds] = useState([]);
  const [FeedData, setFeedData] = useState(null);
  const navigate = useNavigate();

  const readMore = (url) => {
    //open a new tab with the url given
    
    if(url.trim().includes('http')){
      window.open(url, '_blank');
    }else{
      failure('Badly formatted url or resource may have been removed on the server');
    }
  }

  const IamSure = () => {
  let IdToDelete = FeedData.id;
    try {
      deleteDoc(doc(db, "Feeds", IdToDelete.trim())).then(() => {
        success("Succesful removal of a Feed");
        setOpenModal(false);
      }).catch(err => failure(String(err)))
    } catch (error) {
      setOpenModal(false);
      failure(String(error));
    }
    setOpenModal(false);
  }
  useEffect(()=>{
    try {
        if(sessionStorage.getItem("id")===""){
            navigate('/');
          }
    } catch (error) {
        failure(String(error));
        navigate('/');
    }
  },[]);

  useEffect(() => {
    let q = query(collection(db, "Feeds"));
    onSnapshot(q, (querySnapshot) => {
      let temp = [];
      querySnapshot.forEach((doc) => {
        temp.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setFeeds(temp);
    });

  }, []);
  return (
    <>
      <AppHeader />
      <div className="container-fluid">
        <Button data-bs-toggle="modal" data-bs-placement="bottom" data-bs-target="#FeedsModal" color="success" className="m-2">
          <HiNewspaper className="mr-2 h-5 w-5" />
          add a feed
        </Button>
        <div className="row g-0">
          {Feeds?.length > 0 ? Feeds.map((feed) => (
            <div key={feed.id} className="col-md-4 mb-2">
              <Card className="max-w-sm">
                <img className="max-w-sm" src={feed.tumbnail.trim()} alt={'logo'} style={{ aspectRatio: 3 / 3 }} />

                <div className="flex flex-wrap hover:cursor-pointer">
                  <Button size="xs" onClick={() => {
                    setFeedData(feed);
                    setOpenModal(true);
                  }} color="failure">
                    Delete
                  </Button>

                </div>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {feed.title}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {feed.msg}</p>
                <Button color="success" onClick={() => readMore(feed.url)}>
                  Read more
                  <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </Card>
            </div>
          )) : null}


        </div>

      </div>

      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => IamSure()}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <FeedsModal />
    </>
  );
}

export default Feeds;