import { useNavigate } from 'react-router-dom';
import coverimg from '../assets/moneyguy.jpg';
import values from '../assets/value.jpg';
import mission from '../assets/mission.jpg';
import logo from '../assets/moneybag.png';
import { useContext } from 'react';
import { AppContext } from '../States/AppState';
import { Button } from 'flowbite-react';

const AppHeader = () => {

    const { currentTab, setcurrentTab } = useContext(AppContext);
    const navigate = useNavigate();
    const changeRoute = (tab) => {
        navigate('/dashboard');
        if (tab === 'Assigned') {
            setcurrentTab(tab);
        } else if (tab === 'Incoming') {
            setcurrentTab(tab);
        }
    }
    return (
        <header>
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    <div className='d-flex flex-row justify-content-center align-items-center'><img onClick={() => {
                        setcurrentTab("Incoming");
                        navigate('/dashboard');
                    }} src={logo} alt="" width="30" height="24" /> <h4 onClick={() => {
                        setcurrentTab("Incoming");
                        navigate('/dashboard');
                    }} className="navbar-brand">GrantEase</h4></div>

                    <form className="d-flex">
                        <Button onClick={() => navigate('/Feeds')} data-bs-toggle="tooltip" data-bs-placement="bottom" title="Feeds" style={{ marginLeft: "5px" }}
                            type="button"
                            className="btn btn-success"
                        ><i className="fa fa-rss-square" aria-hidden="true"></i></Button>
                        <Button onClick={() => navigate('/ShowDoctors')} data-bs-toggle="tooltip" data-bs-placement="bottom" title="manage doctors" style={{ marginLeft: "5px" }}
                            type="button"
                            className="btn btn-success"
                        ><i className="fa fa-address-book" aria-hidden="true"></i></Button>

                    </form>
                </div>
            </nav>
            <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src={coverimg} className="d-block w-100" alt="..." style={{ height: "300px", objectFit: 'cover' }} />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>First slide label</h5>
                            <p>Some representative placeholder content for the first slide.</p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src={values} className="d-block w-100" alt="..." style={{ height: "300px", objectFit: 'cover' }} />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Second slide label</h5>
                            <p>Some representative placeholder content for the second slide.</p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src={mission} className="d-block w-100" alt="..." style={{ height: "300px", objectFit: 'cover' }} />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Third slide label</h5>
                            <p>Some representative placeholder content for the third slide.</p>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            <div className='navbar-light bg-light d-flex flex-row justify-content-between p-1'>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button onClick={() => changeRoute('Incoming')} type="button" className="btn btn-outline-dark">Incoming Applications</button>
                    <button onClick={() => changeRoute('Assigned')} type="button" className="btn btn-outline-dark">Assigned Applications</button>
                </div>

                <div>
                    <button onClick={()=>{
                        sessionStorage.setItem("id", "");
                        navigate('/');
                }} className="badge rounded-pill bg-dark fa fa-sign-out" aria-hidden="true">log out</button>
                    <span style={{ margin: '5px' }} className="badge bg-success">welcome, Admin</span>
                </div>
            </div>
        </header>
    );
}

export default AppHeader;