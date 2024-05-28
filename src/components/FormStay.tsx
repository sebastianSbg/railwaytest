import { forwardRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod"; // zod is used for form validation
import { zodResolver } from "@hookform/resolvers/zod";
import "../App.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Calendar } from "react-bootstrap-icons";
import "../App.css";
import ScrollableDropdown from "./ScrollableDropdown";

interface FormStayProps {
  disp_string: string[];
  onChangeNumGuests?: any;
}

const schema = z.object({
  stay_valid: z.boolean(),
  stay_arrival_date: z.date(),
  stay_departure_date: z.date(),
});

export type FormStayRef = z.infer<typeof schema>; // this should be used as the ref

export const FormStay = forwardRef<any, FormStayProps>(
  ({ disp_string, onChangeNumGuests }, ref: any) => {
    useEffect(() => {
      setValue("stay_valid", false); // initialize original value
    }, []);

    const {
      formState: { isValid },
      trigger,
      setValue,
    } = useForm<FormStayRef>({ resolver: zodResolver(schema) });

    useEffect(() => {
      console.log("Is valid change!");
      console.log(isValid);
      ref.current = {
        ...ref.current,
        stay_valid: isValid,
      };
      console.log(ref.current);
    }, [isValid]);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [startDate2, setStartDate2] = useState<Date | null>(null);

    return (
      <>
        <div className="form-person">
          <h3 className="display-6 mb-3 center-text">Stay info</h3>

          <div className="input-group mb-4 full-width">
            <span className="input-group-text">
              <Calendar />
            </span>
            <span className="input-group-text">{disp_string[0]}</span>
            <div className="form-control">
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => {
                  setStartDate(date);
                  date ? setValue("stay_arrival_date", date) : null;
                  trigger("stay_arrival_date");
                  ref
                    ? (ref.current = {
                        ...ref.current,
                        stay_arrival_date: date,
                      })
                    : null;
                }}
                className="form-control center-all full-width"
                placeholderText="MM-DD-YYYY"
                aria-label="Select a date"
                aria-describedby="datepicker"
              />
            </div>
          </div>

          <div className="input-group mb-4 full-width">
            <span className="input-group-text">
              <Calendar />
            </span>
            <span className="input-group-text">{disp_string[1]}</span>
            <div className="form-control">
              <DatePicker
                selected={startDate2}
                onChange={(date: Date | null) => {
                  setStartDate2(date);
                  date ? setValue("stay_departure_date", date) : null;
                  trigger("stay_departure_date");
                  ref
                    ? (ref.current = {
                        ...ref.current,
                        stay_departure_date: date,
                      })
                    : null;
                }}
                className="form-control center-all full-width"
                placeholderText="MM-DD-YYYY"
                aria-label="Select a date"
                aria-describedby="datepicker"
              />
            </div>
          </div>

          <ScrollableDropdown
            dispName={disp_string[2]}
            options={["1", "2", "3", "4", "5"]}
            onChange={onChangeNumGuests}
          />
        </div>
      </>
    );
  }
);
