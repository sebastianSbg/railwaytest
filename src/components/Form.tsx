import { useRef, useState, useEffect } from "react";
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

  const [sigValid, setSigValid] = useState(false);
  const [confirmValid, setConfirmValid] = useState(false);
  const [stayValid, setStayValid] = useState(false);
  const [addrValid, setAddrValid] = useState(false);
  const [idValid, setIdValid] = useState(false);

  const [numGuests, setNumGuests] = useState(1);
  // const nightStayRadio = useRef(0);
  const [radioButton, setRadioButton] = useState(0);
  const [_, setLanguage] = useState("English");
  // const [allFormValid, setAllFormValid] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // const [numRender, setNumRender] = useState(0); // used as callback from children to update parent

  // // increment counter everytime parent is rerendered by children
  // const parentIncrease = () => {
  //   setNumRender(numRender + 1);
  // };

  const onRadioButtonUpdate = (value: number) => {
    const wrapperFunction = () => {
      setRadioButton(value);
      console.log(refFormData.current);
    };
    return wrapperFunction;
  };

  let refFormData = useRef<any>({});
  let refSignature = useRef<any>({});

  // let is_valid =
  //   (refFormData.current?.addr_valid &&
  //     refFormData.current?.id_valid &&
  //     refFormData.current?.stay_valid) ||
  //   radioButton == 1;

  let is_valid =
    (sigValid && confirmValid && stayValid && addrValid && idValid) ||
    (radioButton === 1 && sigValid && confirmValid && stayValid);

  useEffect(() => {
    is_valid =
      (sigValid && confirmValid && stayValid && addrValid && idValid) ||
      (radioButton === 1 && sigValid && confirmValid && stayValid);
  }),
    [sigValid, confirmValid, stayValid, addrValid, idValid];

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
                ref={refFormData}
                onLanguageChange={setLanguage}
                onRadioChange={onRadioButtonUpdate}
              />
              <FormStay
                disp_string={["Arrival date", "Departure date", "# of guests"]}
                onChangeNumGuests={setNumGuests}
                onIsValid={setStayValid}
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
                  onValid={setAddrValid}
                  ref={refFormData}
                />
              )}
              {radioButton === 0 && (
                <FormID
                  disp_heading={"ID"}
                  disp_string={[
                    "ID number",
                    "Date issued",
                    "Issuing Institution",
                    "Issuing Country",
                  ]}
                  country_choises={countriesEN}
                  onValid={setIdValid}
                  ref={refFormData}
                />
              )}
              <div className="form-person">
                <h3 className="display-6 mb-4 center-text">Signature</h3>

                <div className="form-check mb4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckChecked"
                    // checked
                    onChange={(e) => {
                      setConfirmValid(e.target.checked);
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckChecked"
                  >
                    I confirm that the provided information is accurate.
                  </label>

                  {!confirmValid && (
                    <p className="text-danger">Must be checked.</p>
                  )}
                </div>

                <div className="center-text mt-4">
                  <Signature onValid={setSigValid} ref={refSignature} />
                  {!sigValid && (
                    <p className="text-danger">Invalid signature</p>
                  )}
                </div>

                <div className="mt-4 mb-2 center-text">
                  <button disabled={!is_valid} className="btn btn-primary">
                    Submit
                  </button>
                  {!is_valid && (
                    <p className="text-danger">
                      One or more entries are incomplete or invalid.
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
