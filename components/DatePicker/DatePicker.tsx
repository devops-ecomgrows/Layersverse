import { CalendarIcon } from '@heroicons/react/solid';
import { forwardRef, useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import Input from '../Input';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  /**
   * Set name for input
   */
  name?: string;

  /**
   * On change date handler
   */
  onChange: (date: Date | null) => void;
  /**
   * Selected date
   */
  selected: Date | null;
  /**
   * The class name of the container of the datepicker
   */
  className?: string;

  placeHolder?: string;
}

const DatePicker = ({
  name,
  onChange,
  selected,
  className,
  placeHolder,
}: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    setSelectedDate(selected);
  }, [selected]);

  const onChangeDate = (date: Date | null) => {
    setSelectedDate(date);
    onChange && onChange(date);
  };

  return (
    <ReactDatePicker
      onChange={onChangeDate}
      selected={selectedDate}
      className={className}
      customInput={
        <Input
          name={name || ''}
          className={`pg-input-datepicker`}
          placeHolder={placeHolder ? placeHolder : 'mm/dd/yyyy'}
          type="text"
          value={selected?.toString()}
          suffix={<CalendarIcon />}
        />
      }
    />
  );
};

export default DatePicker;
