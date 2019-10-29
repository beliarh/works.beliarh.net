import React, { useContext, useMemo } from 'react';
import { Form, Icon, Upload } from 'antd';
import { FormContext, RecordContext } from '../../../contexts';
import customRequest from '../../../utils/customRequest';

const getValueFromEvent = ({ fileList }) => {
  return fileList.map(file => {
    const isError = file.status === 'error';
    const response = typeof file.response === 'object' && file.response;

    if (response) {
      if (isError) {
        file.response = response.message;
      } else {
        file.url = response.data;
      }
    }

    return file;
  });
};

const SiteImagesField = () => {
  const form = useContext(FormContext);
  const site = useContext(RecordContext);
  const images = site && site.images;

  const initialValue = useMemo(() => {
    if (!images) {
      return [];
    }

    return images.map((image, index) => ({
      uid: `-${index}`,
      status: 'done',
      name: image.split('/').pop(),
      url: image,
    }));
  }, [images]);

  return (
    <Form.Item label="Images">
      {form.getFieldDecorator('images', {
        getValueFromEvent,
        initialValue,
        valuePropName: 'fileList',
      })(
        <Upload
          accept="image/jpeg, image/png"
          action="/api/upload-image.php"
          listType="picture-card"
          name="image"
          multiple
          showUploadList={{
            showPreviewIcon: false,
            showRemoveIcon: true,
            showDownloadIcon: true,
          }}
          customRequest={customRequest}
        >
          <Icon type="plus" />
          <div className="ant-upload-text">Upload</div>
        </Upload>
      )}
    </Form.Item>
  );
};

export default SiteImagesField;
