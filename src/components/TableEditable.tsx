"use client";
import Button from "@/components/Button";
import ButtonWithConfim from "@/components/ButtonWithConfim";
import Table from "@/components/Table";
import useEditableDataSource from "@/hooks/useEditableDataSource";
import { useEffect, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlinePlusCircle,
  AiOutlineSave,
} from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";

export default function TableEditable({
  onSaveRow,
  onSaveCell,
  onDeleteRow,
  handleCancelEdit,
  dataSource: dataSourceRaw,
  columns,
  loading,
  expandedRowRender,
  initialValues,
  addButtonText = "Add Row",
}: any) {
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
  ] = useEditableDataSource({
    initialValues,
    rowChangeCallBack: () => {},
  });
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const onCancelEdit = () => {
    setDataSource([...dataSourceRaw]);
    if (handleCancelEdit) handleCancelEdit();
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
    delete data.isEditable;
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

  const handleDeleteRow = async (id: string) => {
    onDeleteRow(id);
  };
  const actionColumns: any = {
    dataIndex: "id",
    title: "Actions",
    width: "170px",
    render: (id: any, record: any) => {
      const expanded = expandedRows?.includes(id);
      return (
        <>
          <Button
            type="primary"
            icon={expanded ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            onClick={() => handleClickExpand(id, expanded ? "close" : "open")}
            disabled={loading || (isEditing && !record?.isEditable)}
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
              }
            }}
            disabled={
              loading ||
              (isEditing && !record?.isEditable && editableCell?.id !== id)
            }
          />
          {record?.isEditable && (
            <Button
              type="danger"
              icon={<MdOutlineCancel />}
              onClick={() => onCancelEdit()}
              disabled={loading || (isEditing && !record?.isEditable)}
            />
          )}
          {!record?.isEditable && (
            <ButtonWithConfim
              type="danger"
              icon={<AiOutlineDelete />}
              disabled={loading || (isEditing && !record?.isEditable)}
              onClick={() => {
                handleDeleteRow(id);
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
