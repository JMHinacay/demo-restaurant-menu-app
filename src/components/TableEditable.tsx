import { useEffect, useState } from "react";
import Button from "@/components/Button";
import ButtonWithConfim from "@/components/ButtonWithConfim";
import Table from "@/components/Table";
import useEditableDataSource from "@/hooks/useEditableDataSource";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlinePlusCircle,
  AiOutlineSave,
} from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";

interface TableEditableProps<T> {
  onSaveRow: (data: T) => void;
  onSaveCell: (cell: any) => void;
  onDeleteRow: (id: string, record?: T) => void;
  onEdit?: () => void;
  onCancelEdit?: () => void;
  dataSource: T[];
  columns: any[];
  loading: boolean;
  expandedRowRender: any;
  initialValues: T;
  addButtonText?: string;
  disabled?: boolean;
}

export default function TableEditable<T>({
  onSaveRow,
  onSaveCell,
  onDeleteRow,
  onEdit,
  onCancelEdit,
  dataSource: dataSourceRaw,
  columns,
  loading,
  expandedRowRender,
  initialValues,
  addButtonText = "Add Row",
  disabled = false,
}: TableEditableProps<T>) {
  const [
    dataSource,
    setDataSource,
    {
      isEditing,
      setIsEditing,
      editableCell,
      setEditableCell,
      editableRow,
      render,
      handleEditRow,
      handleAddRow,
    },
  ] = useEditableDataSource<T>({
    initialValues,
    handleClickCell: (id: string, key: keyof T, value: any, record: T) => {
      if (!editableCell && !isEditing) {
        setIsEditing(true);
        setEditableCell({ id, key, value, record });
        if (onEdit) onEdit();
      }
    },
  });
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const handleCancelEdit = () => {
    setDataSource([...dataSourceRaw]);
    if (onCancelEdit) onCancelEdit();
    setIsEditing(false);
    setEditableCell(null);
  };

  useEffect(() => {
    setDataSource(dataSourceRaw);
    setIsEditing(false);
    setEditableCell(null);
  }, [dataSourceRaw]);

  const handleSaveRow = async () => {
    let data = { ...editableRow };
    onSaveRow(data);
    setIsEditing(false);
    setEditableCell(null);
  };

  const handleSaveCell = async () => {
    onSaveCell(editableCell);
    setIsEditing(false);
    setEditableCell(null);
  };

  const handleClickExpand = (id: string, type: "open" | "close") => {
    if (type === "open") setExpandedRows([...expandedRows, id]);
    else if (type === "close") {
      setExpandedRows(expandedRows?.filter((item) => item !== id));
    }
  };

  const handleDeleteRow = async (id: string, record?: T) => {
    onDeleteRow(id, record);
  };

  const actionColumns: any = {
    dataIndex: "id",
    title: "Actions",
    width: "105px",
    render: (id: any, record: any) => {
      const expanded = expandedRows?.includes(id);

      return (
        <>
          <Button
            type="primary"
            icon={expanded ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            onClick={() => handleClickExpand(id, expanded ? "close" : "open")}
            disabled={
              loading ||
              editableCell?.id === id ||
              (disabled && !record?.isEditable)
            }
          />
          <Button
            type="primary"
            icon={
              record?.isEditable || editableCell?.id === id ? (
                <AiOutlineSave />
              ) : (
                <AiOutlineEdit />
              )
            }
            onClick={() => {
              if (record?.isEditable) {
                handleSaveRow();
              } else if (editableCell && editableCell?.id === id) {
                handleSaveCell();
              } else {
                handleEditRow(record);
                if (onEdit) onEdit();
              }
            }}
            disabled={
              loading ||
              (disabled && !record?.isEditable && editableCell?.id !== id)
            }
          />
          {record?.isEditable && (
            <Button
              type="danger"
              icon={<MdOutlineCancel />}
              onClick={() => handleCancelEdit()}
              disabled={
                loading ||
                editableCell?.id === id ||
                (disabled && !record?.isEditable)
              }
            />
          )}
          {!record?.isEditable && (
            <ButtonWithConfim
              type="danger"
              icon={<AiOutlineDelete />}
              disabled={
                loading ||
                editableCell?.id === id ||
                (disabled && !record?.isEditable)
              }
              onClick={() => {
                handleDeleteRow(id, record);
              }}
              title="Confirm delete item."
              content="Are you sure you want to delete this item?"
            />
          )}
        </>
      );
    },
  };

  const finalColumns: any = columns?.map((item: any) => ({
    ...item,
    render: render({ ...item?.renderOptions }),
  }));
  return (
    <>
      <Table
        dataSource={dataSource}
        columns={[...finalColumns, actionColumns]}
        loading={loading}
        expandedRowRender={expandedRowRender}
        expandedRows={expandedRows}
      />
      <Button
        disabled={isEditing}
        dashed
        onClick={() => handleAddRow()}
        fullWidth
        icon={<AiOutlinePlusCircle />}
      >
        {addButtonText}
      </Button>
    </>
  );
}
