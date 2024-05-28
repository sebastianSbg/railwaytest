import { forwardRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod"; // zod is used for form validation
import { zodResolver } from "@hookform/resolvers/zod";
import "../App.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Calendar } from "react-bootstrap-icons";
import "../App.css";

interface FormIDProps {
  disp_string: string[];
  disp_heading: string;
  country_choises: string[];
  onBlur?: any;
}

const schema = z.object({
  id_valid: z.boolean(),
  id_number: z.string().min(5),
  id_issue_date: z.date(),
  id_institution: z.string(),
  id_country: z.string().refine((value: any) => value !== "Choose...", {
    message: "Select a country",
  }),
});

export type FormIDRef = z.infer<typeof schema>; // this should be used as the ref

export const FormID = forwardRef<any, FormIDProps>(
  ({ disp_string, disp_heading, country_choises, onBlur }, ref: any) => {
    useEffect(() => {
      setValue("id_valid", false); // initialize original value
    }, []);

    const [startDate, setStartDate] = useState<Date | null>(null);

    const {
      register,
      formState: { errors, isValid },
      trigger,
      setValue,
    } = useForm<FormIDRef>({ resolver: zodResolver(schema) });

    return (
      <>
        <div className="form-person">
          <h3 className="display-6 mb-3 center-text">{disp_heading}</h3>

          <div>
            <div className="input-group mb-4">
              <span className="input-group-text" id="basic-addon1">
                {disp_string[0]}
              </span>
              <input
                {...register("id_number")}
                id="id_number"
                type="text"
                className="form-control"
                onBlur={(e) => {
                  trigger("id_number");
                  ref
                    ? (ref.current = {
                        ...ref.current,
                        id_number: e.target.value,
                      })
                    : null;
                  ref
                    ? (ref.current = { ...ref.current, id_valid: isValid })
                    : null;
                  onBlur();
                }}
              />
            </div>
            {errors.id_number && (
              <p className="text-danger floating-text-top">
                {errors.id_number.message}
              </p>
            )}
          </div>

          <div className="input-group mb-4 full-width">
            <span className="input-group-text">
              <Calendar />
            </span>
            <span className="input-group-text">{disp_string[1]}</span>
            <div className="form-control">
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => {
                  setStartDate(date);
                  console.log(date);
                  date ? setValue("id_issue_date", date) : null;
                  ref
                    ? (ref.current = {
                        ...ref.current,
                        id_issue_date: date,
                      })
                    : null;
                  ref
                    ? (ref.current = { ...ref.current, id_valid: isValid })
                    : null;
                }}
                className="form-control center-all full-width"
                placeholderText="MM-DD-YYYY"
                aria-label="Select a date"
                aria-describedby="datepicker"
              />
            </div>
          </div>

          <div>
            <div className="input-group mb-4">
              <span className="input-group-text" id="basic-addon1">
                {disp_string[2]}
              </span>
              <input
                {...register("id_institution")}
                id="id_institution"
                type="text"
                className="form-control"
                onBlur={(e) => {
                  trigger("id_institution");
                  ref
                    ? (ref.current = {
                        ...ref.current,
                        id_institution: e.target.value,
                      })
                    : null;
                  ref
                    ? (ref.current = { ...ref.current, id_valid: isValid })
                    : null;
                  onBlur();
                }}
              />
            </div>
            {errors.id_institution && (
              <p className="text-danger floating-text-top">
                {errors.id_institution.message}
              </p>
            )}
          </div>

          <div className="input-group mb-4">
            <span className="input-group-text" id="basic-addon1">
              {disp_string[3]}
            </span>
            <select
              className="form-select"
              {...register("id_country")}
              id="id_country"
              onBlur={(e) => {
                trigger("id_country");
                ref
                  ? (ref.current = { ...ref.current, id_valid: isValid })
                  : false;
                ref
                  ? (ref.current = {
                      ...ref.current,
                      id_country: e.target.value,
                    })
                  : null;
                console.log(e.target.value);
                onBlur();
              }}
            >
              <option selected>Choose...</option>
              {country_choises.map((option) => (
                <option value={option}>{option}</option>
              ))}
            </select>
          </div>

          {errors.id_country && (
            <p className="text-danger floating-text-top">
              {errors.id_country.message}
            </p>
          )}
        </div>
      </>
    );
  }
);
