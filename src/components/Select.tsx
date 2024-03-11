import React, {
  InputHTMLAttributes,
  PropsWithChildren,
  useRef,
  useState,
} from "react";
import { AiOutlineClose, AiFillCaretDown } from "react-icons/ai";
const Select: React.FC<PropsWithChildren<CombinedProps>> = ({
  options,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const widthRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [hovered, setHovered] = useState(false);

  const handleItemClick = (value: string) => {
    let arr = [];
    if (selected.includes(value))
      arr = selected.filter((item) => item !== value);
    else arr = [...selected, value];
    setSelected(arr);
    if (props?.onChange) props?.onChange(arr as any);
    console.log(arr);
    setFocused(false);
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div>
        <input
          className={"editableInput opacity-0"}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            if (!hovered) setFocused(false);
          }}
          ref={inputRef}
          {...props}
          onChange={undefined}
        />
      </div>
      <div
        ref={widthRef}
        className="flex absolute top-0 border-[1px] h-[30px] pl-2 pr-2 min-w-[198px] items-center"
        onClick={() => inputRef.current?.focus()}
      >
        {selected?.map((item) => (
          <div
            className="h-[24px] bg-gray-200 ml-[1px] mr-[1px] pl-1 pr-1 flex items-center"
            onClick={() => inputRef.current?.focus()}
          >
            {item}
            <AiOutlineClose
              className="text-[15px] text-gray-400 ml-[5px] hover:cursor-pointer"
              onClick={() => {
                handleItemClick(item);
                setHovered(false);
              }}
            />
          </div>
        ))}
        <div className="ml-4"></div>
        <AiFillCaretDown className="mr-[5px] hover:cursor-pointer absolute top-[5px] right-0 text-gray-600" />
      </div>
      {focused && options && (
        <div
          id="fix_width"
          className="absolute block shadow-lg bg-white min-w-6 z-50 p-1"
          style={{ width: widthRef.current?.offsetWidth }}
          onMouseOver={() => {
            setHovered(true);
          }}
          onMouseLeave={() => {
            setHovered(false);
          }}
        >
          <ul>
            {options?.map((item, index) => (
              <li
                style={{
                  backgroundColor: selected.includes(item)
                    ? "rgb(96 165 250 / var(--tw-bg-opacity))"
                    : "",
                  color: selected.includes(item) ? "white" : "",
                }}
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

export default Select;

interface AdditionalProps {
  isEditable?: boolean;
  options?: string[];
  onChange?: (select: string[]) => void;
}
type CombinedProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> &
  AdditionalProps;
