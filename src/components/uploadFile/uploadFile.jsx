import { ChangeEvent, useState } from 'react';
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import envObject from '../../constants/common.js';

const UploadFile = () => {

    const props = {
        name: 'file',
        action: `${envObject.VITE_API_BASE_URL_PROD}/excelupload/upload_rate_excel`,
        headers: {
          authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
              console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
              message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} file upload failed.`);
            }
        }
    }


    return (
        <Upload {...props}>
            <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
    )
}

export default UploadFile