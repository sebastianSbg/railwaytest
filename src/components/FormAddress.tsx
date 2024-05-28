import { forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod"; // zod is used for form validation
import { zodResolver } from "@hookform/resolvers/zod";
import "../App.css";

interface FormAddressProps {
  disp_string: string[];
  disp_heading: string;
  country_choises: string[];
  onBlur?: any;
}

const schema = z.object({
  addr_valid: z.boolean(),
  addr_street: z.string().min(3, { message: "Invalid street" }),
  addr_city: z.string().min(3, { message: "Invalid city" }),
  addr_zip: z.number().min(1000, { message: "Invalid addr_zip code" }),
  addr_country: z.string().refine((value) => value !== "Choose...", {
    message: "Select a country",
  }),
});

export type FormAddressRef = z.infer<typeof schema>; // this should be used as the ref

export const FormAddress = forwardRef<any, FormAddressProps>(
  ({ disp_string, disp_heading, country_choises, onBlur }, ref: any) => {
    useEffect(() => {
      setValue("addr_valid", false); // initialize original value
    }, []);

    const {
      register,
      formState: { errors, isValid },
      trigger,
      setValue,
    } = useForm<FormAddressRef>({ resolver: zodResolver(schema) });

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
                {...register("addr_street")}
                id="steet"
                type="text"
                className="form-control"
                onBlur={(e) => {
                  trigger("addr_street");
                  ref
                    ? (ref.current = {
                        ...ref.current,
                        addr_street: e.target.value,
                      })
                    : null;
                  ref
                    ? (ref.current = { ...ref.current, addr_valid: isValid })
                    : false;
                  onBlur();
                }}
              />
            </div>
            {errors.addr_street && (
              <p className="text-danger floating-text-top">
                {errors.addr_street.message}
              </p>
            )}
          </div>

          <div>
            <div className="input-group mb-4">
              <span className="input-group-text" id="basic-addon1">
                {disp_string[1]}
              </span>
              <input
                {...register("addr_city")}
                id="addr_city"
                type="text"
                className="form-control"
                onBlur={(e) => {
                  trigger("addr_city");
                  ref
                    ? (ref.current = {
                        ...ref.current,
                        addr_city: e.target.value,
                      })
                    : null;
                  ref
                    ? (ref.current = { ...ref.current, addr_valid: isValid })
                    : false;
                  onBlur();
                }}
              />
            </div>
            {errors.addr_city && (
              <p className="text-danger floating-text-top">
                {errors.addr_city.message}
              </p>
            )}
          </div>

          <div>
            <div className="input-group mb-4">
              <span className="input-group-text" id="basic-addon1">
                {disp_string[2]}
              </span>
              <input
                {...register("addr_zip", { valueAsNumber: true })}
                id="addr_zip"
                type="number"
                className="form-control"
                onBlur={(e) => {
                  trigger("addr_zip");
                  ref
                    ? (ref.current = { ...ref.current, addr_valid: isValid })
                    : false;
                  ref
                    ? (ref.current = {
                        ...ref.current,
                        addr_zip: e.target.value,
                      })
                    : null;
                  onBlur();
                }}
              />
            </div>
            {errors.addr_zip && (
              <p className="text-danger floating-text-top">
                {errors.addr_zip.message}
              </p>
            )}
          </div>

          <div className="input-group mb-4">
            <span className="input-group-text" id="basic-addon1">
              {disp_string[3]}
            </span>
            <select
              className="form-select"
              {...register("addr_country")}
              id="addr_country"
              onBlur={(e) => {
                trigger("addr_country");
                ref
                  ? (ref.current = { ...ref.current, addr_valid: isValid })
                  : false;
                ref
                  ? (ref.current = {
                      ...ref.current,
                      addr_country: e.target.value,
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

          {errors.addr_country && (
            <p className="text-danger floating-text-top">
              {errors.addr_country.message}
            </p>
          )}
        </div>
      </>
    );
  }
);
