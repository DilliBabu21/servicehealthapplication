import { Alert, Button, MenuItem, Select } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CancelIcon from '@mui/icons-material/Cancel';
import QueueIcon from '@mui/icons-material/Queue';
import Swal from "sweetalert2";

export default function EditService1() {
  let navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    if (!token || !tokenExpiration) {
        navigate('/auth/login');
    }

    const currentTime = Date.now();
    if (currentTime > tokenExpiration) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        navigate('/auth/login');
    }
}, [navigate]);

  const httpMethods = ["GET", "POST", "PUT", "DELETE"];

  const { id } = useParams();

  const [services, setServices] = useState({
    service_name: "",
    url: "",
    email: "",
    httpMethod: "",
    payload: "",
    customHeaders: []
  });

  const { service_name, url, email, httpMethod, payload, customHeaders } = services;

  useEffect(() => {
    loadServices();
  }, []);

  const onInputChange = (e) => {
    if (e.target.name.startsWith("customHeader")) {
      const index = e.target.getAttribute("data-index");
      const headers = [...customHeaders];
      headers[index].key = e.target.name === "customHeaderKey" ? e.target.value : headers[index].key;
      headers[index].value = e.target.name === "customHeaderValue" ? e.target.value : headers[index].value;
      setServices({ ...services, customHeaders: headers });
    } else {
      setServices({ ...services, [e.target.name]: e.target.value });
    }
  };
  

  

  const loadServices = async () => {
    const result = await axios.get(`http://localhost:8878/healthcheck/service/${id}`);
    setServices(result.data);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:8878/healthcheck/service/${id}`, services);
    Swal.fire({
      position: 'top',
      icon: 'success',
      title: 'Edited Successfully',
      showConfirmButton: false,
      timer: 1000
    }) 
    navigate("/home");
  };

  const addCustomHeader = () => {
    setServices({
      ...services,
      customHeaders: [...customHeaders, { key: '', value: '' }]
    });
  };

  const removeCustomHeader = (index) => {
    const headers = [...customHeaders];
    headers.splice(index, 1);
    setServices({ ...services, customHeaders: headers });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Edit Service</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="mb-3">
              <label htmlFor="service_name" className="form-label">
                Name
              </label>
              <input
                type={"text"}
                className="form-control rounded-pill"
                placeholder="Enter Service name"
                name="service_name"
                value={service_name}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="url " className="form-label">
                Url
              </label>
              <input
                type={"text"}
                className="form-control rounded-pill"
                placeholder="Enter Url"
                name="url"
                value={url}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type={"text"}
                className="form-control rounded-pill"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className='mb-1'>
              <label htmlFor='httpMethod' className='form-label'>
                HTTP Method
              </label>
              <Select
                value={httpMethod}
                onChange={(e) => onInputChange(e)}
                className='form-control rounded-pill' style={{ height: '45px' }}
                name='httpMethod'>
                {httpMethods.map((method, index) => (
                  <MenuItem key={index} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
            </div>
            {/* This will create a dropdown with HTTP methods as options. You can also modify the styles of the Select component as per your requirement. */}


            {httpMethod === "GET" ? null : (
              <div className='mb-3'>
                <label htmlFor='Name' className='form-label'>
                  Payload
                </label>
                <input type={"textarea"} className='form-control rounded-pill' value={payload} onChange={(e) => onInputChange(e)} placeholder='Eg "{"Key": "Value", "key": "value"}"' name='payload' />
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="customHeaders" className="form-label">
                Custom Headers
              </label>
              <button
                type="button"
                className="btn btn-primary btn-sm ms-2"
                onClick={() => addCustomHeader()}
              >
                Add Header
              </button>
              {customHeaders.map((header, index) => (
                <div key={index} className="d-flex align-items-center mt-2">
                  <input
                    type="text"
                    className="form-control rounded-pill me-2"
                    placeholder="Enter Header Key"
                    name="customHeaderKey"
                    value={header.key}
                    data-index={index}
                    onChange={(e) => onInputChange(e)}
                  />
                  <input
                    type="text"
                    className="form-control rounded-pill me-2"
                    placeholder="Enter Header Value"
                    name="customHeaderValue"
                    value={header.value}
                    data-index={index}
                    onChange={(e) => onInputChange(e)}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removeCustomHeader(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button style={{
                backgroundColor: "#0072ff",

              }} variant="contained" type="submit" startIcon={<QueueIcon />} onclick={(e) => onSubmit(e)}>

                Submit
              </Button>

              <Button style={{
                backgroundColor: "#FF4E50",

              }} variant="contained" className="btn btn-secondary mx-2" startIcon={<CancelIcon />} color="error" onClick={() => navigate("/home")}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}