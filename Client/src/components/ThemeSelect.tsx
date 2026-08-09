import "./ThemeSelect.css";

interface ThemeSelectProps {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}


function ThemeSelect({
  title,
  options,
  value,
  onChange,
}: ThemeSelectProps) {


  return (
    <div className="theme-select">

      <h2>
        {title}
      </h2>


      <p className="theme-select-subtitle">
        Choose the option that best describes you.
      </p>


      <select
        className="theme-dropdown"
        value={value}
        onChange={(e) => {
          console.log("Selected:", e.target.value);
          onChange(e.target.value);
        }}
      >


        {options.map((option) => (

          <option
            key={option}
            value={option}
          >
            {option}
          </option>

        ))}


      </select>


    </div>
  );
}


export default ThemeSelect;