import { useState, forwardRef, useEffect } from "react";
import ScrollableDropdown from "./ScrollableDropdown";
import "../App.css";
import { z } from "zod";

interface cf {
  onRadioChange: any; //some function
  onLanguageChange: any;
}

const FormBasicInfo = ({ onRadioChange, onLanguageChange }: cf, ref: any) => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const emailSchema = z.string().email("Please enter a valid email address");

  useEffect(() => {
    ref.current = {
      ...ref.current,
      stay_overnight: true,
    };
  }, []);

  useEffect(() => {
    // keep email in sync with parent ref
    ref.current = {
      ...ref.current,
      email: email,
    };

    // ✅ Validate each time email changes
    const result = emailSchema.safeParse(email);
    if (!result.success && email.length > 0) {
      setEmailError(result.error.errors[0].message);
    } else {
      setEmailError(null);
    }
  }, [email]);

  return (
    <>
      <div className="form-person">
        <h3 className="display-6 mb-3 center-text">Basic Info</h3>
        <p className="mb-3">
          All overnight guests are required to fill out this form to register
          and comply with local regulations:
          <a
            href="https://www.usp.gv.at/brancheninformationen/gastronomie-und-tourismus/gaesteverzeichnis.html"
            target="_blank"
          >
            {" law info"}
          </a>
        </p>
        <p className="mb-4">
          The lockbox code will be provided after on the next page, after the
          form submission.
        </p>
        <ScrollableDropdown
          dispName="Form language"
          options={["English"]}
          onChange={onLanguageChange}
        />

        <div className="input-group mb-4">
          <span className="input-group-text" id="basic-addon1">
            Email address
          </span>
          <input
            type="email"
            className={`form-control ${emailError ? "is-invalid" : ""}`}
            placeholder="example@domain.com"
            aria-label="Email"
            aria-describedby="basic-addon1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* ✅ Inline validation message */}
        {emailError && (
          <div className="text-danger mb-3" style={{ fontSize: "0.9em" }}>
            {emailError}
          </div>
        )}

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadio1"
            checked={selectedOption === 0}
            onClick={() => {
              setSelectedOption(0);
              ref.current = {
                ...ref.current,
                stay_overnight: true,
              };
            }}
            onChange={onRadioChange(0)}
          />
          <label className="form-check-label" htmlFor="flexRadioDefault1">
            I am staying at the Airbnb overnight.
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadio2"
            checked={selectedOption === 1}
            onClick={() => {
              setSelectedOption(1);
              ref.current = {
                ...ref.current,
                stay_overnight: false,
              };
            }}
            onChange={onRadioChange(1)}
          />
          <label className="form-check-label" htmlFor="flexRadioDefault2">
            I am NOT staying at the Airbnb overnight. (Only limited information
            is needed.)
          </label>
        </div>
      </div>
    </>
  );
};

export default forwardRef(FormBasicInfo);
