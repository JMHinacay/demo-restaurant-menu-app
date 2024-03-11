import { useState } from "react";
import Input from "@/components/Input";
import NumeralFormatter from "@/components/NumeralFormatter";
import { MenuItem, MenuItemKeys } from "@/app/types/types";

const inputStyle = { margin: 0, width: "100%" };

type RowChangeCallBackT = (value: string | number, key: string) => void;

interface UseEditableDataSourceT {
  initialValues: MenuItem;
  rowChangeCallBack: RowChangeCallBackT;
}

interface EditableCellT {
  id: string;
  key: string;
  value: any;
  record: object;
}
export interface RenderOptions {
  key: MenuItemKeys;
  inputType: string;
  formatNumber?: boolean;
  categories?: string[];
}

function useEditableDataSource({
  initialValues,
  rowChangeCallBack,
}: UseEditableDataSourceT): [
  MenuItem[],
  (data: MenuItem[]) => void,
  {
    isEditing: boolean;
    setIsEditing: (editing: boolean) => void;
    editableCell: EditableCellT | null;
    setEditableCell: (cell: EditableCellT | null) => void;
    editableRow: MenuItem;
    setEditableRow: (row: MenuItem) => void;
    render: (options: RenderOptions) => any;
    handleEditRow: (record: MenuItem) => void;
    handleAddRow: () => void;
    handleChange: RowChangeCallBackT;
  }
] {
  const [editableRow, setEditableRow] = useState<MenuItem>(initialValues);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<MenuItem[]>([]);
  const [editableCell, setEditableCell] = useState<EditableCellT | null>(null);

  const handleEditRow = (record: MenuItem) => {
    setIsEditing(true);
    const arr = dataSource.map((item) =>
      record?.id === item?.id ? { ...item, isEditable: true } : item
    );
    setDataSource(arr);
    setEditableRow({ ...record });
  };

  const handleChange: RowChangeCallBackT = (value, key) => {
    if (editableCell) {
      setEditableCell({ ...editableCell, value: value });
    } else {
      setEditableRow({ ...editableRow, [key]: value ? value : null });
    }

    if (rowChangeCallBack) {
      rowChangeCallBack(value, key);
    }
  };

  const handleAddRow = () => {
    const newRow: MenuItem = {
      ...initialValues,
      isEditable: true,
    };
    setEditableRow(newRow);
    setDataSource([newRow, ...dataSource]);
    setIsEditing(true);
  };

  const handleClickCell = (
    id: string,
    key: string,
    value: any,
    record: object
  ) => {
    console.log({ id, key, value });
    if (!editableCell && !isEditing) {
      setIsEditing(true);
      setEditableCell({ id, key, value, record });
    }
  };
  const render = ({
    key,
    inputType,
    formatNumber,
    categories,
  }: RenderOptions) => {
    const func = (val: string | number, record: any) => {
      let isEditable =
        record?.isEditable ||
        (editableCell?.id === record?.id && editableCell?.key === key);

      if (!isEditable)
        return (
          <div
            onClick={() =>
              handleClickCell(record.id as string, key, val, record)
            }
          >
            {formatNumber && inputType === "number" ? (
              <NumeralFormatter withPesos={true} value={val} />
            ) : (
              <div>{val}</div>
            )}
          </div>
        );

      const inputProps: any = {
        min: 1,
        isEditable,
        style: inputStyle,
        value: editableCell ? editableCell?.value : editableRow[key],
        onChange: (value: any) => {
          if (isEditable) {
            if (inputType === "select") handleChange(value, key);
            else if (inputType === "text" || inputType === "number")
              handleChange(value.target.value, key);
          }
        },
      };

      switch (inputType) {
        case "number":
          return <Input type="number" {...inputProps} />;
        case "text":
          return (
            <>
              <Input
                type="text"
                {...inputProps}
                autoCompleteList={key === "category" ? categories : undefined}
              />
            </>
          );
      }
    };
    return func;
  };

  return [
    dataSource,
    setDataSource,
    {
      isEditing,
      setIsEditing,
      editableCell,
      setEditableCell,
      editableRow,
      setEditableRow,
      render,
      handleEditRow,
      handleAddRow,
      handleChange,
    },
  ];
}

export default useEditableDataSource;
