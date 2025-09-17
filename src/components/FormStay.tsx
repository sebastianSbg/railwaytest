import { forwardRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod"; // zod is used for form validation
import { zodResolver } from "@hookform/resolvers/zod";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Calendar } from "react-bootstrap-icons";

interface FormStayProps {
  disp_string: string[];
  onChangeNumGuests?: any;
  onIsValid?: any;
}

const schema = z
  .object({
    stay_valid: z.boolean(),
    stay_arrival_date: z.date({ required_error: "Arrival date is required" }),
    stay_departure_date: z.date({
      required_error: "Departure date is required",
    }),
    stay_num_of_guests: z.number({ message: "Required" }).min(1),
  })
  .superRefine((data, ctx) => {
    if (
      data.stay_arrival_date &&
      data.stay_departure_date &&
      data.stay_departure_date <= data.stay_arrival_date
    ) {
      ctx.addIssue({
        path: ["stay_departure_date"],
        code: z.ZodIssueCode.custom,
        message: "Departure date must be after arrival date.",
      });
    }
  });

export type FormStayRef = z.infer<typeof schema>; // this should be used as the ref

export const FormStay = forwardRef<any, FormStayProps>(
  ({ disp_string, onChangeNumGuests, onIsValid }, ref: any) => {
    const {
      formState: { errors, isValid },
      trigger,
      setValue,
    } = useForm<FormStayRef>({ resolver: zodResolver(schema) });

    useEffect(() => {
      setValue("stay_valid", false); // initialize original value
      // trigger("stay_arrival_date");
      // trigger("stay_departure_date");
    }, []);

    useEffect(() => {
      ref.current = {
        ...ref.current,
        stay_valid: isValid,
      };
      onIsValid(isValid);
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
                  ref.current = {
                    ...ref.current,
                    stay_arrival_date: date,
                  };
                }}
                className="form-control center-all full-width"
                placeholderText="MM-DD-YYYY"
                aria-label="Select a date"
                aria-describedby="datepicker"
                onBlur={() => {
                  trigger("stay_arrival_date");
                }}
              />
            </div>
          </div>
          {errors.stay_arrival_date && (
            <p className="text-danger floating-text-top">
              {errors.stay_arrival_date.message}
            </p>
          )}
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
                  ref.current = {
                    ...ref.current,
                    stay_departure_date: date,
                  };
                }}
                className="form-control center-all full-width"
                placeholderText="MM-DD-YYYY"
                aria-label="Select a date"
                aria-describedby="datepicker"
                onBlur={() => {
                  trigger("stay_departure_date");
                }}
              />
            </div>
          </div>
          {errors.stay_departure_date && (
            <p className="text-danger floating-text-top">
              {errors.stay_departure_date.message}
            </p>
          )}

          <div className="input-group mb-4">
            <span className="input-group-text" id="basic-addon1">
              {disp_string[2]}
            </span>
            <select
              className="form-select"
              id="stay_num_guests"
              onBlur={() => {
                trigger("stay_num_of_guests");
              }}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setValue("stay_num_of_guests", value);
                trigger("stay_num_of_guests");
                ref.current = {
                  ...ref.current,
                  stay_num_of_guests: value,
                };
                onChangeNumGuests(value);
              }}
            >
              <option value="">Choose...</option>
              {[1, 2, 3, 4, 5].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {errors.stay_num_of_guests && (
            <p className="text-danger floating-text-top">
              {errors.stay_num_of_guests.message}
            </p>
          )}
        </div>
      </>
    );
  }
);
