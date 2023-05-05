import React from 'react';
import cross from '../images/multiply.png'


const ServiceUnavailablePage = () => {
  return (
    <div style={{ textAlign: 'center',marginTop: '10rem'  }}>
      <h1 style={{ color: 'red' }}>Service Unavailable</h1>
      <p style={{ fontSize: '1.2rem' }}>We're sorry, the service you're trying to access is currently unavailable. Please try again later.</p>
      <img src={cross} alt="Service Unavailable" style={{ maxWidth: '5%', marginTop: '0rem' }} />
    </div>
  );
};

export default ServiceUnavailablePage;


