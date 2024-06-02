import { useRef, useState, forwardRef, useEffect } from "react";
import ScrollableDropdown from "./ScrollableDropdown";
import "../App.css";

interface cf {
  onRadioChange: any; //some function
  onLanguageChange: any;
}

const FormBasicInfo = ({ onRadioChange, onLanguageChange }: cf, ref: any) => {
  const [selectedOption, setSelectedOption] = useState(0);

  const localRef = useRef(0);

  useEffect(() => {
    ref.current = {
      ...ref.current,
      stay_overnight: true,
    };
  }, []);

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

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadio1"
            checked={selectedOption === 0}
            onClick={() => {
              setSelectedOption(0);
              localRef.current = 0;
              ref.current = 0;
              console.log(localRef.current);
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
              localRef.current = 1;
              ref.current = 1;
              console.log(localRef.current);
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
