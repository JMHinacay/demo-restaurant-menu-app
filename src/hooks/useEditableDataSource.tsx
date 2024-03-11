import { useState } from "react";
import Input from "@/components/Input";
import NumeralFormatter from "@/components/NumeralFormatter";

const inputStyle = { margin: 0, width: "100%" };

type RowChangeCallBackT<T> = (value: string | number, key: keyof T) => void;

interface UseEditableDataSourceT<T> {
  initialValues: T;
  rowChangeCallBack: RowChangeCallBackT<T>;
}

interface EditableCellT<T> {
  id: string;
  key: keyof T;
  value: any;
  record: T;
}

export interface RenderOptions<T> {
  key: keyof T;
  inputType: string;
  formatNumber?: boolean;
  categories?: string[];
}

function useEditableDataSource<T>({
  initialValues,
  rowChangeCallBack,
}: UseEditableDataSourceT<T>): [
  T[],
  (data: T[]) => void,
  {
    isEditing: boolean;
    setIsEditing: (editing: boolean) => void;
    editableCell: EditableCellT<T> | null;
    setEditableCell: (cell: EditableCellT<T> | null) => void;
    editableRow: T;
    setEditableRow: (row: T) => void;
    render: (options: RenderOptions<T>) => any;
    handleEditRow: (record: T) => void;
    handleAddRow: () => void;
    handleChange: RowChangeCallBackT<T>;
  }
] {
  const [editableRow, setEditableRow] = useState<T>(initialValues);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [editableCell, setEditableCell] = useState<EditableCellT<T> | null>(
    null
  );

  const handleEditRow = (record: any) => {
    setIsEditing(true);
    const arr = dataSource.map((item: any) =>
      record?.id === item?.id ? { ...item, isEditable: true } : item
    );
    setDataSource(arr);
    setEditableRow({ ...record });
  };

  const handleChange: RowChangeCallBackT<T> = (value, key) => {
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
    const newRow = {
      ...initialValues,
      isEditable: true,
    };
    setEditableRow(newRow);
    setDataSource([newRow, ...dataSource]);
    setIsEditing(true);
  };

  const handleClickCell = (id: string, key: keyof T, value: any, record: T) => {
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
  }: RenderOptions<T>) => {
    const func = (val: string | number, record: T) => {
      let isEditable =
        (record as any)?.isEditable ||
        (editableCell?.id === (record as any)?.id && editableCell?.key === key);

      if (!isEditable)
        return (
          <div
            onClick={() =>
              handleClickCell((record as any).id as string, key, val, record)
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
                autoCompleteList={
                  key === "category" ? (categories as string[]) : undefined
                }
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
