import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Modal } from 'antd';
import DynamicTable from './components/table/dynamicTable';
import axios from 'axios';
import { formatDate } from './assets/utility/common';
//import API from './../config';
import envObject from './constants/common';
import url from './url';
const App = () => {
  const [fileArray, setFileArray] = useState([]);

  useEffect(() => {
    getGridData();
  },[])

  const getGridData = async () => {
    try {
      const URL=url()==true?envObject.VITE_API_BASE_URL_DEV:envObject.VITE_API_BASE_URL_PROD;
      const response = await axios.get(`${URL}/get_grid_record`,{
        headers: {
          'api-key': url()==true?envObject.API_KEY_DEV:envObject.API_KEY_PROD,
          'accept': 'application/json'
        }});
      if (response.data && response.data.data.length) {
        const customizedData = response.data.data.map((item)=> {
          return {...item,timestamp: formatDate(item.timestamp, 'display-date-Time')}
        }).reverse();
        setFileArray(customizedData)
      }
    } catch (error) {
      console.log(error);
      setFileArray([]);
    }
  }

  return (
    <Card title="Excel Upload And Summary">
       <Row>
        <Col span={24}>
          <DynamicTable fileArray={fileArray} />
        </Col>
       </Row>
    </Card>
  )
}

export default App
