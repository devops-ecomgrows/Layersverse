import React from 'react';

interface IProps {
  label?: string;
  disabled?: boolean;
  defaultChecked?: boolean;
  onChange: (checked: boolean) => void;
  checked?: boolean;
  className?: string;
}

const CheckBox = ({
  label,
  disabled,
  defaultChecked,
  onChange,
  checked,
  className,
}: IProps): JSX.Element => {
  const onSelected = () => {
    !disabled && onChange(!checked);
  };
  return (
    <div className={`${className}`}>
      <input
        type="checkbox"
        className="custom-input"
        checked={checked}
        defaultChecked={defaultChecked}
      />
      <label
        className={`text-sm ${
          disabled ? 'checkbox-disable' : 'checkbox-enable'
        }`}
        onClick={onSelected}
      >
        {label && label}
      </label>
    </div>
  );
};
export default CheckBox;
