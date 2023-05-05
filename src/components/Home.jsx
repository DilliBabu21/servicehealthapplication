import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import { Alert, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';


export default function Home() {

  const [isServiceUnavailable, setIsServiceUnavailable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [services, setServices] = useState([]);
  const [token, setToken] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    if (!token || !tokenExpiration) {
      navigate("/auth/login");
    }

    const currentTime = Date.now();
    if (currentTime > tokenExpiration) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      navigate("/auth/login");
    }

    setToken(token);
  }, [navigate]);

  const authAxios = axios.create({
    baseURL: "http://localhost:8878/healthcheck",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const loadServices = async () => {
    try {
      const result = await authAxios.get(`services`);
      setServices(result.data);
    } catch (error) {
      try {
        const backupResult = await axios.get(`http://localhost:9991/check/services`);
        // if (backupResult.data[0].fallbackMessage === "Service Unavailable") {
        //   navigate(`/ServiceUnavailablePage`);
        // } else {
        setServices(backupResult.data);

      } catch (backupError) {
        console.log(backupError);
        navigate(`/ServiceUnavailablePage`);
        // setServices([]);

      }
    }



  };



  const handlePageChange = (result) => {
    setCurrentPage(result.target.value);
  }

  const handleItemsPerPageChange = (result) => {
    setItemsPerPage(result.target.value);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = services.slice(indexOfFirstItem, indexOfLastItem);


  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(services.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map(number => {
    return (
      <option key={number} value={number}>
        {number}
      </option>
    );
  });




  // useEffect(() => {
  //    loadServices();
  // }, [services]);

  useEffect(() => {
    loadServices();
    // setTimeout(loadServices, 5000);

  }, []);


  const deleteService = async (id) => {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    })

      .then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`http://localhost:8878/healthcheck/service/${id}`);
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
          loadServices();
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your Service is safe :)',
            'error'
          );
          // loadServices(); // load services after deletion
        }
      });

  };

  const sendEmail = async () => {
    await axios.post(`http://localhost:8878/healthcheck/service/send-email`);
    console.log("Email Sent");
    <Alert>Email Sent</Alert>;
    loadServices();
  };

  const checkAllServices = async () => {
    try {
      const response = await axios.get(`http://localhost:9991/check/service/checkall`);
    
      loadServices();

      if (response.data === "Service unavailable") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Service Unavailable try again later!',
          footer: '<a href="">Why do I have this issue?</a>'
        })
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Service Unavailable try again later!',
        footer: '<a href="">Why do I have this issue?</a>'
      })

    }

  };

  const checkService = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:9991/check/service/check/${id}`
      );
      loadServices();
      if (response.data.fallbackMessage === "Service Unavailable") {

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Service Unavailable try again later!',
          footer: '<a href="">Why do I have this issue?</a>'
        })


      }

    } catch (error) {
      loadServices();
      console.error(error);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Service Unavailable try again later!',
        footer: '<a href="">Why do I have this issue?</a>'
      })
    }
  };
  var d = new Date();
  var ISTTime = new Date(d.getTime() + (330 * 60 * 1000));
  ISTTime.toLocaleString();

  return (

    <div >

      <div className='container' style={{ display: 'flex', justifyContent: 'center' }}>




        <div className='py-4'>

          <div className="d-flex justify-content-end mb-3 ">
            <div className='btn3'>
              <Button style={{
                backgroundColor: "#1FA2FF",

              }} variant="contained" startIcon={<AddTaskIcon />} className="mx-1" onClick={() => navigate(`/addService`)} >Add Service</Button>
            </div>
            <div className='btn1'>
              
              <Button style={{
                backgroundColor: "#e6b400",

              }} variant="contained" startIcon={<CheckCircleIcon />} color='success' onClick={checkAllServices}>Check All</Button>
              
            </div>
            <div className='btn2'>
              <Button variant="contained" startIcon={<EmailIcon />} color='primary' onClick={sendEmail}>Send Email</Button>
            </div>


          </div>



          <table className="table table-responsive table-hover border shadow" style={{ width: '90%' }}>

            <thead>
              <tr>
                <th scope='col' className="align-middle">Service Id</th>
                <th scope="col" className="align-middle">Service Name</th>
                <th scope="col" className="align-middle">Url</th>
                <th scope="col" className="align-middle">Email</th>
                <th scope="col" className="align-middle">HTTPMethod</th>
                <th scope="col" className="align-middle">Status</th>
                <th scope="col" className="align-middle">Checked Time</th>
                <th scope='col' className="align-middle">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentServices.map((service, index) => (
                <tr>
                  <th scope="row" className="align-middle">{index + 1}</th>
                  <td className="align-middle">{service.service_name}</td>
                  <td className="align-middle">{service.url}</td>
                  <td className="align-middle">{service.email}</td>
                  <td className="align-middle">{service.httpMethod}</td>
                  <td className="align-middle">
                    <span className={service.status === "UP" ? "badge bg-success" : service.status === "DOWN" ? "badge bg-danger" : service.status === "UNKNOWN" ? "badge bg-secondary" : service.status === "ERROR" ? "badge bg-info" : "badge bg-warning"} title={service.status === "ERROR" ? service.responseCode : service.status === "UP" ? service.responseCode : service.status === "DOWN" ? service.responseMessage : ""}>  {service.status}
                    </span>

                  </td>

                  <td className="align-middle">{new Date(service.checkedAt).toLocaleString("en-IN")}</td>
                  <td className="align-middle">
                    <div className="d-flex justify-content-around">
                      <Button variant="contained"
                        className="btn btn-primary mx-1" startIcon={<NetworkCheckIcon />}
                        onClick={() => checkService(service.id)}
                      >
                        Check
                      </Button>
                      <Button style={{
                        backgroundColor: "#21b6ae",

                      }} variant="contained" className="mx-1" startIcon={<EditIcon />} onClick={() => navigate(`/editservice1/${service.id}`)}>Edit</Button>
                      <Button style={{
                        backgroundColor: "#DB2B39",

                      }} variant="contained" className="btn btn-primary mx-1" startIcon={<DeleteIcon />} color="error" onClick={() => deleteService(service.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {services.length > 0 && (
            <div>
              <label>Page:</label>
              <select value={currentPage} onChange={handlePageChange}>
                {renderPageNumbers}
              </select>

              <label>Items per page:</label>
              <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </div>

          )}
        </div>
      </div>


    </div>

  )

}    