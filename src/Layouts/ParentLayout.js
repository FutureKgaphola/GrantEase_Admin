import { Link, Outlet } from 'react-router-dom';
import logo from '../assets/moneybag.png';
import { Footer,ListGroup } from 'flowbite-react';
import { HiHome, HiUserCircle, HiRss, HiPhoneOutgoing,HiOutlineMail } from 'react-icons/hi';

const ParentLayout = () => {

  return (
    <div className="ParentLayout">
      <main>
        <Outlet />
      </main>
      <Footer container>
        <div className="w-full text-center">
          <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
            <Footer.Brand
              href="/dashboard"
              src={logo}
              alt="GrantEase Logo"
              name="GrantEase"
            />
            <Footer.LinkGroup className="w-72">
                <ListGroup.Item  icon={HiHome}><Link to={'/dashboard'}>Home</Link></ListGroup.Item>
                <ListGroup.Item icon={HiUserCircle}><Link to={'/ShowDoctors'}>Doctors</Link></ListGroup.Item>
                <ListGroup.Item icon={HiRss}><Link to={'/Feeds'}>Feeds</Link></ListGroup.Item>
                <ListGroup.Item icon={HiPhoneOutgoing}>Contact : 011 500 4040</ListGroup.Item>
                <ListGroup.Item icon={HiOutlineMail}>admin@grantease.co.za</ListGroup.Item>
            </Footer.LinkGroup>
          </div>
          <Footer.Divider />
          <Footer.Copyright by="GrantEase" year={2024} />
        </div>
      </Footer>
    </div>
  );
}

export default ParentLayout;