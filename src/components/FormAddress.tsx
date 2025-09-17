import { forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod"; // zod is used for form validation
import { zodResolver } from "@hookform/resolvers/zod";
import "../App.css";

interface FormAddressProps {
  disp_string: string[];
  disp_heading: string;
  country_choises: string[];
  onValid?: any;
}

const noNumbers = (value: string) => !/\d/.test(value);

const schema = z.object({
  addr_valid: z.boolean(),
  addr_street: z
    .string()
    .min(3, { message: "Invalid street" })
    .refine((street) => !street.toLowerCase().includes("stierlingwaldst"), {
      message:
        "The Address has to be your personal address, not the Airbnb address.",
    }),
  addr_city: z
    .string()
    .min(3, { message: "Invalid city" })
    .refine(noNumbers, { message: "City should not contain numbers" })
    .refine((city) => !/^b.rmoos$/i.test(city), {
      message: "Select your own address not the city of the Airbnb.",
    }),
  addr_zip: z
    .number({ message: "The ZIP code must be a number." })
    .min(1000, { message: "Zip Code must be larger than 1000." })
    .refine((zip) => zip !== 5111, {
      message: "Use your personal address, not the Airbnb ZIP code.",
    }),
  addr_country: z
    .string()
    .min(1, { message: "Select a country" })
    .refine((value) => value !== "Choose...", {
      message: "Select a country",
    }),
});

export type FormAddressRef = z.infer<typeof schema>; // this should be used as the ref

export const FormAddress = forwardRef<any, FormAddressProps>(
  ({ disp_string, disp_heading, country_choises, onValid }, ref: any) => {
    useEffect(() => {
      if (ref.current) {
        if ("addr_valid" in ref.current) {
          setValue("addr_valid", ref.current.addr_valid);
          trigger("addr_valid");
        } else {
          setValue("addr_valid", false);
          trigger("addr_valid");
        }
        if ("addr_street" in ref.current) {
          setValue("addr_street", ref.current.addr_street);
          trigger("addr_street");
        }
        if ("addr_city" in ref.current) {
          setValue("addr_city", ref.current.addr_city);
          trigger("addr_city");
        }
        if ("addr_zip" in ref.current) {
          setValue("addr_zip", ref.current.addr_zip);
          trigger("addr_zip");
        }
        if ("addr_country" in ref.current) {
          setValue("addr_country", ref.current.addr_country);
          trigger("addr_country");
        }
        return;
      }
      setValue("addr_valid", false); // initialize original value
      ref.current = {
        ...ref.current,
        addr_valid: false,
      };
    }, []);

    const {
      register,
      formState: { errors, isValid },
      trigger,
      setValue,
    } = useForm<FormAddressRef>({ resolver: zodResolver(schema) });

    useEffect(() => {
      console.log("addr_valid_changed");
      console.log(isValid);

      ref.current = {
        ...ref.current,
        addr_valid: isValid,
      };
      onValid(isValid);
    }, [isValid]);

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
              <input
                {...register("addr_street")}
                id="steet"
                type="text"
                className="form-control"
                onInput={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  ref
                    ? (ref.current = {
                        ...ref.current,
                        addr_street: e.target.value,
                      })
                    : null;
                  setValue("addr_street", ref.current["addr_street"]);
                  trigger("addr_street");
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
                placeholder={set_placeholder("addr_city", ref)}
                onInput={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  ref
                    ? (ref.current = {
                        ...ref.current,
                        addr_city: e.target.value,
                      })
                    : null;

                  setValue("addr_city", ref.current["addr_city"]);
                  trigger("addr_city");
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
                placeholder={set_placeholder("addr_zip", ref)}
                onInput={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  ref
                    ? (ref.current = {
                        ...ref.current,
                        addr_zip: e.target.value,
                      })
                    : null;
                  setValue("addr_zip", ref.current["addr_zip"]);
                  trigger("addr_zip");
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
              onChange={(e) => {
                ref
                  ? (ref.current = {
                      ...ref.current,
                      addr_country: e.target.value,
                    })
                  : null;
                setValue("addr_country", ref.current["addr_country"]);
                trigger("addr_country");
              }}
            >
              <option selected>{set_placeholder("addr_country", ref)}</option>
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
