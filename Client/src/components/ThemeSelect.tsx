import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="theme-select">
      <h2>{title}</h2>

      <p className="theme-select-subtitle">
        Choose the option that best describes you.
      </p>

      <div className={`theme-dropdown ${isOpen ? "open" : ""}`}>
        <button
          type="button"
          className="theme-dropdown-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{value}</span>

          <span className={`theme-dropdown-arrow ${isOpen ? "rotated" : ""}`}>
            ▾
          </span>
        </button>

        <div className={`theme-dropdown-menu ${isOpen ? "open" : ""}`}>
  {options.map((option) => (
    <button
      type="button"
      key={option}
      className={`theme-dropdown-option ${
        option === value ? "selected" : ""
      }`}
      onClick={() => handleSelect(option)}
    >
      {option}
    </button>
  ))}
</div>
      </div>
    </div>
  );
}

export default ThemeSelect;