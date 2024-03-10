import React, {
  InputHTMLAttributes,
  PropsWithChildren,
  useRef,
  useState,
} from "react";

const Input: React.FC<PropsWithChildren<CombinedProps>> = ({
  autoCompleteList,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleItemClick = (value: string) => {
    if (props?.onChange) {
      props.onChange({ target: { value: value } } as any);
    }
    setFocused(false);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const inputWidth = inputRef.current?.offsetWidth;

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <span>
        <input
          className={"editableInput"}
          style={{ paddingLeft: 20 }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            if (!hovered) setFocused(false);
          }}
          ref={inputRef}
          {...props}
        />
      </span>
      {focused && autoCompleteList && (
        <div
          id="fix_width"
          style={{ width: inputWidth }}
          className="absolute block shadow-lg bg-white min-w-6 z-50 p-1"
          onMouseOver={() => {
            setHovered(true);
          }}
          onMouseLeave={() => {
            setHovered(false);
          }}
        >
          <ul>
            {autoCompleteList?.map((item, index) => (
              <li
                className="p-1 hover:bg-blue-400 hover:text-white"
                key={index}
                onClick={() => handleItemClick(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Input;

interface AdditionalProps {
  isEditable?: boolean;
  autoCompleteList?: string[];
}
type CombinedProps = InputHTMLAttributes<HTMLInputElement> & AdditionalProps;
