import DatePicker from "react-datepicker";
import { useState, forwardRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import TextField from "./TextField";
import { Controller } from "react-hook-form";

const MyDatePicker = ({ id, getValues, control }: any) => {
  return (
    <TextField id={id} variant="outlined" getValues={getValues}>
      <TextField.InputBox>
        <Controller
          name={id}
          control={control}
          defaultValue={getValues(id)}
          render={({
            field: { onChange, onBlur, ref, value = new Date() },
          }) => {
            return (
              <DatePicker
                selected={value}
                dateFormat="yyyy-MM-dd"
                onChange={onChange}
                customInput={
                  <ExampleCustomInput onChange={onChange} value={value} />
                }
              />
            );
          }}
        />
      </TextField.InputBox>
    </TextField>
  );
};

const ExampleCustomInput = forwardRef(({ value, onClick, onChange }: any) => {
  console.log(onClick);
  return (
    <>
      <TextField.Input value={value} onClick={onClick} onChange={onChange} />
      <TextField.Label label="date" />
    </>
  );
});

export default MyDatePicker;
