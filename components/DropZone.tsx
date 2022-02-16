import React, { CSSProperties, Fragment, useCallback } from 'react';
import { merror } from '../libs/message';
import Thumbnail from './Thumbnail';
import Utils from '../utils/utils';
import Dropzone from 'react-dropzone';
import Spinner from './Spinner';

interface IProps {
  onChange: (acceptedFiles: File[]) => void;
  label?: string;
  acceptType?: string | string[];
  files?: any[];
  loading?: boolean;
  resetAfterUpload?: boolean;
  multiple?: boolean;
}

interface IThumbNail extends File {
  preview?: string;
}

const baseStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  cursor: 'pointer',
  transition: 'border .24s ease-in-out',
};

const activeStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

const CustomDropzone = ({
  onChange,
  label,
  acceptType,
  loading,
  resetAfterUpload,
  multiple = true,
}: IProps): JSX.Element => {
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    // Catch rejected files
    if (fileRejections.length > 0) {
      merror(`Cannot upload this file! Please select correct file extension`);
      return;
    }

    //Create thumbnail urls
    acceptedFiles.map((file: File) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    ) as IThumbNail[];
    onChange(acceptedFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStyle = (
    isDragAccept: boolean,
    isDragActive: boolean,
    isDragReject: boolean,
  ) => {
    return {
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    };
  };

  return (
    <Fragment>
      {label && (
        <label
          htmlFor={label}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="mt-1">
        <Dropzone
          multiple={multiple}
          onDrop={onDrop}
          accept={acceptType}
          disabled={loading}
        >
          {({
            getRootProps,
            getInputProps,
            isDragAccept,
            isDragActive,
            isDragReject,
            acceptedFiles,
          }) => (
            <section>
              <div
                {...getRootProps({
                  style: getStyle(isDragAccept, isDragActive, isDragReject),
                })}
              >
                {loading ? (
                  <div
                    className={
                      'bg-transparent opacity-95 z-10 bg-opacity-90 w-full h-full flex justify-center flex-col items-center'
                    }
                  >
                    <Spinner />
                    <div className="text-sm">
                      We&apos;re uploading your file! Please stand still!
                    </div>
                  </div>
                ) : (
                  <React.Fragment>
                    <input {...getInputProps()} />
                    {resetAfterUpload || !acceptedFiles.length ? (
                      <p className="text-sm">
                        Drag &apos;n&apos; drop files here, or click to select
                        files
                      </p>
                    ) : (
                      <ul className="text-sm">
                        {acceptedFiles.map((file: IThumbNail) => (
                          <li
                            key={file.name}
                            className="flex items-center gap-4"
                          >
                            <Thumbnail
                              src={file.preview}
                              width={100}
                              height={100}
                            />
                            {file.name} - {Utils.bytesToSize(file.size, 0)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </React.Fragment>
                )}
              </div>
            </section>
          )}
        </Dropzone>
      </div>
    </Fragment>
  );
};

export default CustomDropzone;
