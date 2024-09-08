import { forwardRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod"; // zod is used for form validation
import { zodResolver } from "@hookform/resolvers/zod";
import "../App.css";
import { Calendar } from "react-bootstrap-icons";
import DatePicker from "react-datepicker";

interface FormPersonProps {
  disp_heading: string;
  disp_string: string[];
  disp_sex_options: string[];
  disp_country_options: string[];
  id?: number;
  onValid?: any;
}

// Custom function to check for the presence of numbers in a string
const noNumbers = (value: string) => !/\d/.test(value);

const schema = z.object({
  person_valid: z.boolean(),
  person_first_name: z
    .string()
    .min(2, { message: "Invalid first name." })
    .refine(noNumbers, { message: "First name should not contain numbers." }),
  person_last_name: z
    .string()
    .min(2, { message: "Invalid last name." })
    .refine(noNumbers, { message: "Last name should not contain numbers." }),
  person_country: z.string().min(1, { message: "Please select a country." }),
  person_sex: z.string().min(1, { message: "Please select a sex." }),
  person_birth_date: z.date({ message: "Please select a birth date." }),
});

export type FormPersonRef = z.infer<typeof schema>; // this is like an interface

export const FormPerson = forwardRef<any, FormPersonProps>(
  (
    {
      disp_heading,
      disp_string,
      disp_country_options,
      disp_sex_options,
      id,
      onValid,
    },
    ref: any
  ) => {
    useEffect(() => {
      if (ref.current) {
        console.log("useEFFECT");
        console.log(ref.current);
        console.log("person_birth_date_" + id);
        if ("person_valid_" + id in ref.current) {
          setValue("person_valid", ref.current["person_valid_" + id]);
          trigger("person_valid");
        } else {
          setValue("person_valid", false);
          trigger("person_valid");
          ref ? (ref.current["person_valid_" + id] = false) : null;
        }
        if ("person_first_name_" + id in ref.current) {
          setValue("person_first_name", ref.current["person_first_name_" + id]);
          trigger("person_first_name");
          console.log("person_first_name_valid");
        }
        if ("person_last_name_" + id in ref.current) {
          setValue("person_last_name", ref.current["person_last_name_" + id]);
          trigger("person_last_name");
        }
        if ("person_country_" + id in ref.current) {
          setValue("person_country", ref.current["person_country_" + id]);
          trigger("person_country");
        }
        if ("person_sex_" + id in ref.current) {
          setValue("person_sex", ref.current["person_sex_" + id]);
          trigger("person_sex");
        }
        if ("person_birth_date_" + id in ref.current) {
          setValue("person_birth_date", ref.current["person_birth_date_" + id]);
          trigger("person_birth_date");
          setStartDate(ref.current["person_birth_date_" + id]);
          console.log("Person birth date " + id);
        }
        return;
      }
      setValue("person_valid", false); // initialize original value
      ref ? (ref.current["person_valid_" + id] = false) : null;
    }, []);

    const {
      register,
      formState: { errors, isValid },
      trigger,
      setValue,
    } = useForm<FormPersonRef>({ resolver: zodResolver(schema) });

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    useEffect(() => {
      console.log("person_valid_changed");
      console.log(isValid);
      console.log(ref.current);
      ref ? (ref.current["person_valid_" + id] = isValid) : null;
      onValid ? onValid(id, isValid) : null;
    }, [isValid]);

    const [startDate, setStartDate] = useState<Date | null>(null);

    const set_placeholder = (
      field_name: any,
      ref: any,
      default_value?: any
    ) => {
      let fieldExists = false;

      if (ref.current) {
        // Check if the field exists in ref.current
        fieldExists = field_name.toString() in ref.current;
      }

      if (fieldExists) {
        return ref.current[field_name];
      } else {
        return default_value ? default_value : "";
      }
    };

    return (
      <>
        <div className="form-person">
          <h3 className="display-6 mb-3 center-text">{disp_heading}</h3>
          <div>
            <div className="input-group mb-4">
              <span className="input-group-text" id="basic-addon1">
                {disp_string[0]}
              </span>
              {/* <label htmlFor="last_name" className="form-label"></label> */}
              <input
                {...register("person_first_name")}
                id={"person_first_name_" + id}
                type="text"
                className="form-control"
                placeholder={set_placeholder("person_first_name_" + id, ref)}
                onInput={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  // trigger("person_first_name");
                  ref
                    ? (ref.current["person_first_name_" + id] = e.target.value)
                    : null;
                  console.log("Name input");
                  await sleep(300);
                  trigger("person_first_name");
                }}
                onBlur={() => {
                  trigger("person_first_name");
                }}
              />
            </div>
            {errors.person_first_name && (
              <p className="text-danger floating-text-top">
                {errors.person_first_name.message}
              </p>
            )}
          </div>
          <div>
            <div className="input-group mb-4">
              <span className="input-group-text" id="basic-addon1">
                {disp_string[1]}
              </span>
              {/* <label htmlFor="last_name" className="form-label"></label> */}
              <input
                {...register("person_last_name")}
                id={"person_last_name_" + id}
                type="text"
                placeholder={set_placeholder("person_last_name_" + id, ref)}
                className="form-control"
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  ref
                    ? (ref.current["person_last_name_" + id] = e.target.value)
                    : null;
                  trigger("person_last_name");
                }}
              />
            </div>
            {errors.person_last_name && (
              <p className="text-danger floating-text-top">
                {errors.person_last_name.message}
              </p>
            )}
          </div>
          <div className="input-group mb-4">
            <span className="input-group-text" id="basic-addon1">
              {disp_string[2]}
            </span>
            <select
              className="form-select"
              {...register("person_country")}
              id="person_country"
              onBlur={(e) => {
                trigger("person_country");
                ref
                  ? (ref.current["person_country_" + id] = e.target.value)
                  : null;
              }}
            >
              <option selected>
                {set_placeholder("person_country_" + id, ref)}
              </option>
              {disp_country_options.map((option) => (
                <option value={option}>{option}</option>
              ))}
            </select>
          </div>

          {errors.person_country && (
            <p className="text-danger floating-text-top">
              {errors.person_country.message}
            </p>
          )}

          <div className="input-group mb-4">
            <span className="input-group-text" id="basic-addon1">
              {disp_string[3]}
            </span>
            <select
              className="form-select"
              {...register("person_sex")}
              id="person_sex"
              onBlur={(e) => {
                trigger("person_sex");
                ref ? (ref.current["person_sex_" + id] = e.target.value) : null;
              }}
            >
              <option selected>
                {set_placeholder("person_sex_" + id, ref)}
              </option>
              {disp_sex_options.map((option) => (
                <option value={option}>{option}</option>
              ))}
            </select>
          </div>
          {errors.person_sex && (
            <p className="text-danger floating-text-top">
              {errors.person_sex.message}
            </p>
          )}

          <div className="input-group mb-4 full-width">
            <span className="input-group-text">
              <Calendar />
            </span>
            <span className="input-group-text">{disp_string[4]}</span>
            <div className="form-control">
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => {
                  setStartDate(date);
                  date ? setValue("person_birth_date", date) : null;
                  trigger("person_birth_date");
                  ref ? (ref.current["person_birth_date_" + id] = date) : null;
                }}
                className="form-control center-all full-width"
                placeholderText="MM-DD-YYYY"
                aria-label="Select a date"
                aria-describedby="datepicker"
                onBlur={() => {
                  trigger("person_birth_date");
                }}
              />
            </div>
          </div>
          {errors.person_birth_date && (
            <p className="text-danger floating-text-top">
              {errors.person_birth_date.message}
            </p>
          )}
        </div>
      </>
    );
  }
);
