import React, { useState, useEffect } from 'react';
import { Space, Table, Input, Button, Modal, Dropdown, Menu, Form, DatePicker } from 'antd';
import UploadFile from '../uploadFile/uploadFile';
import axios from 'axios';
import { formatDate } from '../../assets/utility/common';
import envObject from '../../constants/common';
import url from '../../url';

const { Search } = Input;
const styleAction1 = {
  "fontWeight": "700",
  "fontSize": "19px",
  "position": "relative",
  "bottom": "-10px"
};
const styleAction2 = {
  "transform": "rotate(270deg)"
}


const DynamicTable = ({ fileArray }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [resetForm, setResetForm] = useState(false);
  

  useEffect(() => {
    const data = fileArray
    setFilteredData(data);
  }, [fileArray]);

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const filtered = fileArray.filter((item) =>
        item.summeryDataId.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredData(filtered);
    } else {
      const data = fileArray
      setFilteredData(data);
    }
  };

  const handleDownload = async(e, record) => {
    try { 
      const URL=url()==true?envObject.VITE_API_BASE_URL_DEV:envObject.VITE_API_BASE_URL_PROD;
      const res = await axios.get(`${URL}/get_all_transform_record?uploadId=${record.summeryDataId}`, {
        headers: {
          'api-key': url()==true?envObject.API_KEY_DEV:envObject.API_KEY_PROD,
          'accept': 'application/json'
        }});
      if (res.data.status && res.data.status == 'success') {
        const jsonString = JSON.stringify(res.data.data);
        const blob = new Blob([jsonString], { type: "application/json" });
        const dLink = document.createElement('a');
        dLink.download = `${record.summeryDataId}.json`;
        dLink.href = URL.createObjectURL(blob);
        dLink.click();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openRateForm = (record, type) => {
    if (type == 'viewRate') {
      setModalTitle('View Premium Rate')
      setModalContent(<CalculatePremiumForm resetForm={true} uploadID={record.summeryDataId}/>);
    } else {
      setModalTitle('Upload Excel File Here')
      setModalContent(<UploadFile />);
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  const columns = [
    {
      title: 'Upload ID',
      dataIndex: 'summeryDataId',
      key: 'summeryDataId',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Total Sheet Count',
      dataIndex: 'sheetCount',
      key: 'sheetCount',
    },
    {
      title: 'Criteria Count',
      dataIndex: 'criteria_row_count',
      key: 'criteria_row_count',
    },
    {
      title: 'Total Record Count',
      dataIndex: 'totalRateUploaded',
      key: 'totalRateUploaded',
    },
    {
      title: 'Uploaded Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="json" onClick={(e) => handleDownload(e, record)}>
                  <a id={record.name}>Rate JSON</a>
                </Menu.Item>
                <Menu.Item key="text">
                  <a onClick={() => openRateForm(record, 'viewRate')}>Premium Rate</a>
                </Menu.Item>
              </Menu>
            }
          >
            <div style={styleAction2}>
              <a style={styleAction1}>...</a>
            </div>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className='search-upload'>
        <Search
          placeholder='Search by Upload ID'
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 16, width: 250 }}
        />
        <Button
          type='primary'
          onClick={() => openRateForm(true, 'upload')}
          style={{ position: 'absolute', right: 0 }}
        >
          Upload
        </Button>
      </div>
      <Table columns={columns} dataSource={filteredData} />
      <DynamicModal 
        title={modalTitle}
        component={modalContent}
        showModal={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel} />
    </>
  );
};

const CalculatePremiumForm = ({resetForm, uploadID}) => {
  const [premiumPrc, setPremiumPrc] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    if (resetForm) form.resetFields();
  },[resetForm,form]);

  const onFinish = async (values) => {
    console.log('Success:', values);
    try {
      
      const URL=url()==true?envObject.VITE_API_BASE_URL_DEV:envObject.VITE_API_BASE_URL_PROD;
      const { gender,tobacco,productTerm, age, ppt, fromDate, varientCode } = values;
      const fDate = formatDate(fromDate, 'form-date');
      const response = await axios.get(`${URL}/single_premium_record?age=${age}&ppt=${ppt}&from=${fDate}&gender=${gender}&variant_code=${varientCode}&product_term=${productTerm}&tobacco=${tobacco}&uploadId=${uploadID}`, {
        headers: {
          'api-key': url()==true?envObject.API_KEY_DEV:envObject.API_KEY_PROD,
          'accept': 'application/json'
        }})
      console.log(response);
      if (response.data.status == "success" && response.data.data) {
        if (response.data.data.premium) setPremiumPrc(response.data.data.premium);
      }
      else setPremiumPrc("N/A");
    } catch (error) {
      console.log(error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Gender"
        name="gender"
        rules={[
          {
            required: true,
            message: 'This field is required!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Tobacco"
        name="tobacco"
        rules={[
          {
            required: true,
            message: 'This field is required!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Product Term"
        name="productTerm"
        rules={[
          {
            required: true,
            message: 'This field is required!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Age"
        name="age"
        rules={[
          {
            required: true,
            message: 'This field is required!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="PPT"
        name="ppt"
        rules={[
          {
            required: true,
            message: 'This field is required!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Varient Code"
        name="varientCode"
        rules={[
          {
            required: true,
            message: 'This field is required!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="DatePicker" name="fromDate"
        rules={[
          {
            required : true,
            message : 'This field is required!'
          }
        ]}
      >
          <DatePicker />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Get Premium Price
        </Button>
      </Form.Item>
      </Form>
      <h3 style={{"text-align" : "center", "color" : "#0080ff"}}> {premiumPrc ? `Premium Price is` : ""} {premiumPrc ? `${premiumPrc}` : ""}</h3>
    </>
  )
}

const DynamicModal = ({ component, showModal, handleOk, handleCancel, title }) => {
  return (
    <Modal
      title={title}
      open={showModal}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {component}
    </Modal>
  )
}

export default DynamicTable;
