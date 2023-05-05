import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import { Select, MenuItem } from "@mui/material";
import QueueIcon from '@mui/icons-material/Queue';
import Swal from "sweetalert2";





export default function AddService1() {
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



    const [services, setServices] = useState([]);

    const httpMethods = ["GET", "POST", "PUT", "DELETE"];

    const [service_name, setServiceName] = useState('');
    const [url, setUrl] = useState('');
    const [email, setEmail] = useState('');
    const [httpMethod, setHttpMethod] = useState('GET');
    const [payload, setPayload] = useState('');
    const [customHeaders, setCustomHeaders] = useState([]);


    const handleSubmit = (event) => {
        event.preventDefault();

        // Email validation
        if (typeof email !== "undefined") {
            //regular expression for email validation
            var pattern = new RegExp(
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
            if (!pattern.test(email)) {
                alert("Email is not valid");
                return false;
            }
        }
        if (!service_name) {
            return alert("Service name cannot be empty");
        }
        if (!httpMethod) {
            return alert("HttpMthod cannot be empty");
        }
        if (!url) {
            return alert("Service url cannot be empty");
        }

        axios.post('http://localhost:8878/healthcheck/service/add', { service_name, url, email, httpMethod, payload, customHeaders })


            .then((res) => {
                console.log(res.data);
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: 'Added Successfully',
                    showConfirmButton: false,
                    timer: 1000
                  }) 
                loadServices()
                navigate("/home")

            })
            .catch((error) => {
                console.log(error);
            });
    };

    const loadServices = async () => {
        const token = localStorage.getItem("token");
        const result = await axios.get(`http://localhost:8878/healthcheck/services`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setServices(result.data);
    };

    

    return (
        <div className='container'>
            <div className='row'>

                <div className='col-md-6 offset-md-3 border rounded p-4 mt-3 shadow-lg'>
                    <h2 className='text-center m-2'>Add Service</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>
                                Service Name
                            </label>
                            <input type={"text"} className='form-control rounded-pill' value={service_name} onChange={(e) => setServiceName(e.target.value)} placeholder='Enter Service Name' name='name' />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>
                                Service Url
                            </label>
                            <input type={"text"} className='form-control rounded-pill' value={url} onChange={(e) => setUrl(e.target.value)} placeholder='Enter Service Url' name='name' />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>
                                Email
                            </label>
                            <input type={"text"} className='form-control rounded-pill' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Owner Email' name='name' />
                        </div>
                        <div className='mb-1'>
                            <label htmlFor='Name' className='form-label'>
                                HTTP Method
                            </label>
                            <Select
                                value={httpMethod}
                                onChange={(e) => setHttpMethod(e.target.value)}
                                className='form-control rounded-pill' style={{ height: '45px' }}
                            >
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
                                <input type={"textarea"} className='form-control rounded-pill' value={payload} onChange={(e) => setPayload(e.target.value)} placeholder='Eg "{"Key": "Value", "key": "value"}"' name='payload' />
                            </div>
                        )}

                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>
                                Custom Headers
                            </label>
                            <button type="button"  className="btn btn-primary btn-sm ms-2" onClick={() => {
                                    const newHeaders = [...customHeaders];
                                    newHeaders.push({ key: '', value: '' });
                                    setCustomHeaders(newHeaders);
                                }}>Add Header</button>
                            <div>
                                {customHeaders.map((header, index) => (
                                    <div key={index} className="d-flex align-items-center mt-2">
                                        <input type="text" className="form-control rounded-pill me-2" value={header.key} placeholder="Key" onChange={(e) => {
                                            const newHeaders = [...customHeaders];
                                            newHeaders[index].key = e.target.value;
                                            setCustomHeaders(newHeaders);
                                        }} />
                                        <input type="text"  className="form-control rounded-pill me-2" value={header.value} placeholder="Value" onChange={(e) => {
                                            const newHeaders = [...customHeaders];
                                            newHeaders[index].value = e.target.value;
                                            setCustomHeaders(newHeaders);
                                        }} />
                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => {
                                            const newHeaders = [...customHeaders];
                                            newHeaders.splice(index, 1);
                                            setCustomHeaders(newHeaders);
                                        }}>Remove</button>
                                    </div>
                                ))}
                                
                            </div>
                        </div>




                        <div className="text-center">
                            <Button style={{
                                backgroundColor: "#0072ff",

                            }} variant="contained" type="submit" startIcon={<QueueIcon />} onclick={handleSubmit}>

                                Submit
                            </Button>

                            <Button style={{
                                backgroundColor: "#FF4E50",

                            }} variant="contained" className="btn btn-primary mx-2" startIcon={<CancelIcon />} color="error" onClick={() => navigate("/home")}>
                                Cancel
                            </Button>

                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}
