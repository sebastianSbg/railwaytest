type ScrollableDropdownProps = {
  dispName: string;
  options: string[];
  onChange?: any;
};

const ScrollableDropdown = ({
  dispName,
  options,
  onChange,
}: ScrollableDropdownProps) => {
  return (
    <div className="input-group mb-4">
      <span className="input-group-text" id="basic-addon1">
        {dispName}
      </span>
      <select
        className="form-select"
        id="specificSizeSelect"
        onChange={onChange ? (event) => onChange(event.target.value) : () => {}}
      >
        <option selected>Choose...</option>
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default ScrollableDropdown;
