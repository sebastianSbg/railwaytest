import { useRef, useState } from "react";
import axios from "axios";
import { Signature } from "./Signature";
import countriesEN from "../assets/listOfCountries";
import "../App.css";
import { FormStay } from "./FormStay";
import FormBasicInfo from "./FormBasicInfo";
import { FormAddress } from "./FormAddress";
import { FormID } from "./FormID";
import { FormPerson } from "./FormPerson";

function range1(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i + 1);
}

interface Data {
  [key: string]: any;
}

let data: Data = {};

// const onSubmit = (event) => {
//   // data = { ...data, signature: getSVG() };
//   event.preventDefau
//   // console.log(data);
//   axios.post("http://127.0.0.1:8000/store/products/", data);
//   console.log("Form submitted.");
// };

const Form = () => {
  const LOCKBOX_CODE = import.meta.env.VITE_LOCKBOX_CODE;

  const [numGuests, setNumGuests] = useState(1);
  const nightStayRadio = useRef(0);
  const [radioButton, setRadioButton] = useState(0);
  const [_, setLanguage] = useState("English");
  // const [allFormValid, setAllFormValid] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [numRender, setNumRender] = useState(0); // used as callback from children to update parent

  // increment counter everytime parent is rerendered by children
  const parentIncrease = () => {
    setNumRender(numRender + 1);
  };

  const onRadioButtonUpdate = (value: number) => {
    const wrapperFunction = () => {
      setRadioButton(value);
    };
    return wrapperFunction;
  };

  let refFormData = useRef<any>(null);
  let refSignature = useRef<any>(null); // TODO: enforce better typing?

  // let is_valid =
  //   (refFormData.current?.addr_valid &&
  //     refFormData.current?.id_valid &&
  //     refFormData.current?.stay_valid) ||
  //   radioButton == 1;

  let is_valid = true;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!is_valid) {
      return;
    }

    // TODO: validate that signature is OK
    data = { ...data, ...refFormData.current };
    data = { ...data, signature: refSignature.current.getSVG() };
    console.log(data);

    axios
      .post(
        "https://formbackend-production-6eb5.up.railway.app/store/products/",
        data
      )
      .then((response) => {
        console.log("Form submitted successfully:", response.data);
        setFormSubmitted(true);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        // Handle error (e.g., show an error message to the user)
      });
  };

  return (
    <>
      {!formSubmitted && (
        <div>
          <form onSubmit={handleSubmit}>
            <div className="form-div-mobile">
              <FormBasicInfo
                ref={nightStayRadio}
                onLanguageChange={setLanguage}
                onRadioChange={onRadioButtonUpdate}
              />
              <FormStay
                disp_string={["Arrival date", "Departure date", "# of guests"]}
                onChangeNumGuests={setNumGuests}
                ref={refFormData}
              />
              {radioButton === 0 &&
                range1(numGuests).map((item, index) => (
                  <>
                    <FormPerson
                      ref={refFormData}
                      id={index}
                      disp_heading={"Info guest" + " " + item}
                      disp_country_options={countriesEN}
                      disp_labels={[
                        "First name",
                        "Last name",
                        "Country of citizenship",
                        "Gender",
                        "Birth date",
                      ]}
                      disp_sex_options={["Male", "Female", "Other"]}
                    />
                  </>
                ))}
              {radioButton === 0 && (
                <FormAddress
                  disp_heading={"Address"}
                  disp_string={["Street", "City", "Zip", "Country"]}
                  country_choises={countriesEN}
                  onBlur={parentIncrease}
                  ref={refFormData}
                />
              )}
              {radioButton === 0 && (
                <FormID
                  disp_heading={"ID"}
                  disp_string={[
                    "ID #",
                    "Date issued",
                    "Institution",
                    "Issuing Country",
                  ]}
                  country_choises={countriesEN}
                  onBlur={parentIncrease}
                  ref={refFormData}
                />
              )}
              <div className="form-person text-center">
                <h3 className="display-6 mb-3 center-text">Signature</h3>
                <Signature ref={refSignature} />
                <div className="mt-5 mb-2">
                  <button disabled={!is_valid} className="btn btn-primary">
                    Submit
                  </button>
                  {!is_valid && (
                    <p className="text-danger">
                      Not all fields are valid! Can't submit until the form is
                      corrected!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
      {formSubmitted && (
        <>
          <div className="text-center mt-5">
            <h1 mb-5>Thank you for submitting the form!</h1>
            <h2 mb-5>The lock-box code is: {LOCKBOX_CODE}</h2>
          </div>
        </>
      )}
    </>
  );
};

export default Form;