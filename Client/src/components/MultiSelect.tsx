import "./MultiSelect.css";

interface MultiSelectProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
}

function MultiSelect({
  title,
  options,
  selected,
  onChange,
}: MultiSelectProps) {


  const toggleOption = (option: string) => {

    if (selected.includes(option)) {

      onChange(
        selected.filter(
          (item) => item !== option
        )
      );

    } else {

      onChange([
        ...selected,
        option
      ]);

    }

  };


  return (
    <div className="multi-select">

      <h2>
        {title}
      </h2>

      <p className="multi-select-subtitle">
        Select all technologies you are comfortable with.
      </p>


      <div className="multi-grid">

        {options.map((option) => (

          <div
            key={option}
            className={
              selected.includes(option)
                ? "multi-option selected"
                : "multi-option"
            }
            onClick={() => toggleOption(option)}
          >

            <div className="checkbox-icon">

              {
                selected.includes(option)
                  ? "✓"
                  : ""
              }

            </div>


            <span>
              {option}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}

export default MultiSelect;