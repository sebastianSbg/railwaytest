import { forwardRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod"; // zod is used for form validation
import { zodResolver } from "@hookform/resolvers/zod";
import "../App.css";
import { Calendar } from "react-bootstrap-icons";
import DatePicker from "react-datepicker";

interface FormPersonProps {
  disp_heading: string;
  disp_labels: string[];
  disp_sex_options: string[];
  disp_country_options: string[];
  id?: number;
}

const schema = z.object({
  person_valid: z.boolean(),
  first_name: z.string().min(3),
  last_namme: z.string().min(3),
  birth_date: z.date(),
  country: z.string().min(3, { message: "title must be at least 3" }),
  sex: z.string().min(3),
});

export type FormPersonRef = z.infer<typeof schema>; // this is like an interface

export const FormPerson = forwardRef<any, FormPersonProps>(
  (
    { disp_heading, disp_labels, disp_country_options, disp_sex_options, id },
    ref: any
  ) => {
    useEffect(() => {
      setValue("person_valid", false); // initialize original value
    }, []);

    const {
      register,
      formState: { errors },
      trigger,
      setValue,
    } = useForm<FormPersonRef>({ resolver: zodResolver(schema) });

    const [startDate, setStartDate] = useState<Date | null>(null);

    return (
      <>
        <div className="form-person">
          <h3 className="display-6 mb-3 center-text">{disp_heading}</h3>
          <div>
            <div className="input-group mb-4">
              <span className="input-group-text" id="basic-addon1">
                {disp_labels[0]}
              </span>
              {/* <label htmlFor="last_name" className="form-label"></label> */}
              <input
                {...register("first_name")}
                id="first_name"
                type="text"
                className="form-control"
                onBlur={(e) => {
                  trigger("first_name");
                  ref
                    ? (ref.current["person_first_name_" + id] = e.target.value)
                    : null;
                }}
              />
            </div>
            {errors.first_name && (
              <p className="text-danger">{errors.first_name.message}</p>
            )}
          </div>
          <div>
            <div className="input-group mb-4">
              <span className="input-group-text" id="basic-addon1">
                {disp_labels[1]}
              </span>
              {/* <label htmlFor="last_name" className="form-label"></label> */}
              <input
                {...register("last_namme")}
                id="last_namme"
                type="text"
                className="form-control"
                onBlur={(e) => {
                  trigger("last_namme");
                  ref
                    ? (ref.current["person_last_name_" + id] = e.target.value)
                    : null;
                }}
              />
            </div>
            {errors.last_namme && (
              <p className="text-danger">{errors.last_namme.message}</p>
            )}
          </div>
          <div className="input-group mb-4">
            <span className="input-group-text" id="basic-addon1">
              {disp_labels[2]}
            </span>
            <select
              className="form-select"
              {...register("country")}
              id="id_country"
              onBlur={(e) => {
                trigger("country");
                ref
                  ? (ref.current["person_country_" + id] = e.target.value)
                  : null;
              }}
            >
              <option selected>Choose...</option>
              {disp_country_options.map((option) => (
                <option value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="input-group mb-4">
            <span className="input-group-text" id="basic-addon1">
              {disp_labels[3]}
            </span>
            <select
              className="form-select"
              {...register("sex")}
              id="id_country"
              onBlur={(e) => {
                trigger("sex");
                ref ? (ref.current["person_sex_" + id] = e.target.value) : null;
              }}
            >
              <option selected>Choose...</option>
              {disp_sex_options.map((option) => (
                <option value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="input-group mb-4 full-width">
            <span className="input-group-text">
              <Calendar />
            </span>
            <span className="input-group-text">{disp_labels[4]}</span>
            <div className="form-control">
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => {
                  setStartDate(date);
                  console.log(date);
                  date ? setValue("birth_date", date) : null;
                  ref ? (ref.current["person_birth_date_" + id] = date) : null;
                }}
                className="form-control center-all full-width"
                placeholderText="MM-DD-YYYY"
                aria-label="Select a date"
                aria-describedby="datepicker"
              />
            </div>
          </div>
        </div>
      </>
    );
  }
);
