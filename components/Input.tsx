import { ExclamationCircleIcon } from '@heroicons/react/solid';
import React, {
  ChangeEvent,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface InputProps {
  /**
   * Set label for input
   */
  label?: string;
  /**
   * Set name for input
   */
  name?: string;
  /**
   * Set placeholder for input
   */
  placeHolder?: string;
  /**
   * Set type for input
   */
  type: string;
  /**
   * Set help text for input
   */
  helpText?: string;
  /**
   * Set prefix icon for input
   */
  prefix?: React.ReactNode;
  /**
   * Set suffix icon for input
   */
  suffix?: React.ReactNode;
  /**
   * Set onchange handler for input
   */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Set onclick handler for input
   */
  onClick?: () => void;
  /**
   * Set onEnter handler for input
   */
  onEnter?: () => void;
  /**
   * Set onBlur handler for input
   */
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Set value for input
   */
  value?: string | number;
  /**
   * The class name of the container of the input
   */
  className?: string;
  /**
   * The class name of the container of the input
   */
  error?: ReactNode;
  /**
   * Disable state of input
   */
  disabled?: boolean;
  /**
   * Max length of input
   */
  maxLength?: number;

  /**
   * Autocomplete
   */
  autoComplete?: string;

  /**
   * Rows Textarea
   */
  rows?: number;
}

const Input = ({
  type = 'text',
  label,
  name,
  placeHolder,
  helpText,
  prefix,
  suffix,
  onChange,
  onClick,
  onEnter,
  value = '',
  className,
  error,
  onBlur,
  disabled,
  maxLength,
  autoComplete,
  rows,
}: InputProps) => {
  const [inputValue, setInputValue] = useState<string | number>('');
  const classNameInput = useMemo(() => {
    const common = error
      ? 'block w-full border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 rounded-md '
      : 'focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md';
    return [
      'printgrows-input',
      common,
      prefix && 'pl-10',
      suffix && 'pr-10',
      disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
    ]
      .filter(Boolean)
      .join(' ');
  }, [prefix, suffix, error, disabled]);

  const onChangeInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInputValue(e.target.value);
    onChange && onChange(e as ChangeEvent<HTMLInputElement>);
  };

  const onBlurInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onBlur && onBlur(e as ChangeEvent<HTMLInputElement>);
  };

  const onKeyDownInput = (
    e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    switch (e.key) {
      case 'Enter':
        onEnter && onEnter();
    }
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className={`pg-form-control relative ${className || ''}`}>
      {/** Label rendering */}
      {label && (
        <label
          htmlFor={label}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className={`mt-1 relative rounded-md`}>
        {/** Prefix icon rendering */}
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="printgrows-button-icon w-5 h-5 text-gray-400 text-sm">
              {prefix}
            </span>
          </div>
        )}
        {type === 'textarea' ? (
          <textarea
            name={name || label}
            className={classNameInput}
            placeholder={placeHolder}
            onChange={onChangeInput}
            onClick={onClick}
            onBlur={onBlurInput}
            onKeyDown={onKeyDownInput}
            value={inputValue}
            disabled={disabled}
            maxLength={maxLength}
            rows={rows}
          />
        ) : (
          <input
            type={type}
            name={name || label}
            className={classNameInput}
            placeholder={placeHolder}
            onChange={onChangeInput}
            onClick={onClick}
            onBlur={onBlurInput}
            onKeyDown={onKeyDownInput}
            value={inputValue}
            disabled={disabled}
            maxLength={maxLength}
            autoComplete={autoComplete}
          />
        )}
        {/** Suffix icon rendering */}
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="printgrows-button-icon w-5 h-5 text-gray-400 text-sm">
              {suffix}
            </span>
          </div>
        )}

        {/** Error icon rendering */}
        {error && (
          <p className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </p>
        )}
      </div>
      {/** Error text rendering */}
      {error && (
        <p className="mt-1 absolute text-sm text-red-600" id={name + '-error'}>
          {error}
        </p>
      )}
      {/** Help text rendering */}
      {helpText && <p className="mt-2 text-sm text-gray-600">{helpText}</p>}
    </div>
  );
};

export default Input;
