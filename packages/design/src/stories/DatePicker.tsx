import DatePicker from "react-datepicker";
import { forwardRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import TextField from "./TextField";
import { Controller } from "react-hook-form";
import IconButton from "./IconButton";
import IconCalendar from "../../public/calendar_icon.svg";

const MyDatePicker = ({ id, getValues, control }: any) => {
  return (
    <TextField id={id} variant="outlined" getValues={getValues} support>
      <Controller
        name={id}
        control={control}
        defaultValue={getValues(id)}
        render={({ field: { onChange, onBlur, ref, value = new Date() } }) => {
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

      <TextField.SupportBox helper="yyyy-mm-dd"></TextField.SupportBox>
    </TextField>
  );
};

const ExampleCustomInput = forwardRef(({ value, onClick, onChange }: any) => {
  return (
    <TextField.InputBox style={{ padding: "4px 16px" }}>
      <TextField.Input value={value} onChange={onChange} />
      <TextField.Label label="date" />
      <IconButton variant="contained" onClick={onClick}>
        <IconCalendar />
      </IconButton>
    </TextField.InputBox>
  );
});

export default MyDatePicker;
