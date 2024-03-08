import { MenuItem, MenuItemKeys } from "@/app/types/types";
import Input from "@/components/Input";
import NumeralFormatter from "@/components/NumeralFormatter";
import Select from "@/components/Select";
import React, { useState } from "react";
const inputStyle = { margin: 0, width: "100%" };

type UseEditableDataSourceT = {
  initialValues: MenuItem;
  rowChangeCallBack: RowChangeCallBackT;
  categories: string[];
};

type EditableCellT = {
  id: string;
  key: string;
  value: any;
};
type RowChangeCallBackT = (value: string | number, key: string) => void;
function useEditableDataSource({
  initialValues,
  rowChangeCallBack,
  categories,
}: UseEditableDataSourceT) {
  const [editableRow, setEditableRow] = useState<MenuItem>(initialValues);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<MenuItem[]>([]);
  const [editableCell, setEditableCell] = useState<EditableCellT | null>();
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

  const handleClickCell = (id: string, key: string, value: any) => {
    setIsEditing(true);
    if (!editableCell) {
      setEditableCell({ id, key, value });
    }
  };
  const render = (
    key: MenuItemKeys,
    inputType: string,
    formatNumber: boolean
  ) => {
    const func = (val: string | number, record: any) => {
      let isEditable =
        record?.isEditable ||
        (editableCell?.id === record?.id && editableCell?.key === key);

      if (!isEditable)
        return (
          <div onClick={() => handleClickCell(record.id, key, val)}>
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

  const returnVal: HookReturn = [
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
  return returnVal;
}
type ObjOjb = {
  isEditing: boolean;
  setIsEditing: any;
  editableCell: any;
  setEditableCell: any;
  editableRow: any;
  setEditableRow: any;
  render: any;
  handleEditRow: (record: MenuItem) => void;
  handleAddRow: any;
  handleChange: any;
};
type HookReturn = [MenuItem[], (any: any) => void, obj: ObjOjb];
export default useEditableDataSource;
