"use client";
import Button from "@/components/Button";
import ButtonWithConfim from "@/components/ButtonWithConfim";
import Table from "@/components/Table";
import useEditableDataSource from "@/hooks/useEditableDataSource";
import useFireBase from "@/hooks/useFireBase";
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
import { uuid } from "uuidv4";
import { ColumnT, MenuItem } from "./types/types";

export default function Home() {
  const [readData, writeData, updateData, loading] = useFireBase();
  const [categories, setCategories] = useState<string[]>([]);
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
    categories,
  });
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const handleClickExpand = (id: string, type: "open" | "close") => {
    if (type === "open") setExpandedRows([...expandedRows, id]);
    else if (type === "close") {
      setExpandedRows(expandedRows?.filter((item) => item !== id));
    }
  };
  const submitMenuItem = async () => {
    let data = { ...editableRow };
    delete data.isEditable;
    data.category = removeExtraSpaces(data.category);
    if (data?.id) {
      let obj: any = {};
      obj[`menu/items/${data?.id}`] = data;
      await updateData(obj, () => {
        alert("Menu item successfully updated!");
      });
    } else {
      await writeData<MenuItem>(`menu/items/${uuid()}`, data, () => {
        alert("Menu item successfully saved!");
      });
    }
    fetchMenuItems();
    setIsEditing(false);
    setEditableCell(false);
  };

  const handleSaveCell = async () => {
    await writeData<MenuItem>(
      `menu/items/${editableCell?.id}/${editableCell?.key}`,
      editableCell?.value,
      async () => {
        alert("Menu item successfully saved!");
        fetchMenuItems();
        setIsEditing(false);
        setEditableCell(false);
      }
    );
  };

  const fetchMenuItems = async () => {
    const data = await readData("menu/items");
    setDataSource(data);
  };

  const handleCancelEdit = () => {
    fetchMenuItems();
    setIsEditing(false);
  };
  const handleDeleteItem = async (id: string) => {
    await writeData<null>(`menu/items/${id}`, null, () => {
      alert("Menu item successfully deleted!");
      fetchMenuItems();
    });
  };
  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const arr = Array.from(new Set(dataSource?.map((item) => item.category)));
    setCategories(arr);
  }, [dataSource]);

  const expandedColumns: ColumnT<any>[] = [
    // { dataIndex: "", title: "", width: "80%" },
    { dataIndex: "name", title: "Name" },
    { dataIndex: "additionalCost", title: "Additional Cost" },
  ];

  const columns: ColumnT<MenuItem>[] = [
    {
      dataIndex: "name",
      title: "Name",
      render: render("name", "text"),
    },
    {
      dataIndex: "category",
      title: "Category",
      render: render("category", "text"),
    },
    {
      dataIndex: "price",
      title: "Price",
      render: render("price", "number", true),
      width: "150px",
    },
    {
      dataIndex: "cost",
      title: "Cost",
      render: render("cost", "number", true),
      width: "150px",
    },
    {
      dataIndex: "qty",
      title: "Quantity",
      render: render("qty", "number"),
      width: "150px",
    },
    {
      dataIndex: "id",
      title: "Actions",
      width: "170px",
      render: (id, record) => {
        const expanded = expandedRows?.includes(id);
        return (
          <>
            <Button
              type="primary"
              icon={expanded ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              onClick={() => handleClickExpand(id, expanded ? "close" : "open")}
              disabled={isEditing && !record?.isEditable}
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
                  submitMenuItem();
                } else if (editableCell && editableCell?.id === id) {
                  handleSaveCell();
                } else {
                  handleEditRow(record);
                }
              }}
              disabled={
                isEditing && !record?.isEditable && editableCell?.id !== id
              }
            />
            {record?.isEditable && (
              <Button
                type="danger"
                icon={<MdOutlineCancel />}
                onClick={() => handleCancelEdit()}
                disabled={isEditing && !record?.isEditable}
              />
            )}
            {!record?.isEditable && (
              <ButtonWithConfim
                type="danger"
                icon={<AiOutlineDelete />}
                disabled={isEditing && !record?.isEditable}
                onClick={() => {
                  handleDeleteItem(id);
                }}
                title="Confirm delete item."
                content="Are you sure you want to delete this item?"
              />
            )}
          </>
        );
      },
    },
  ];
  return (
    <main className="flex min-h-screen flex-col  justify-between p-10">
      <div>
        <Table
          dataSource={dataSource}
          columns={columns}
          expandedRows={expandedRows}
          expandedRowRender={(record: MenuItem) => {
            return (
              <>
                <div className="font-bold"> {record?.name} Options</div>
                <Table
                  columns={expandedColumns}
                  dataSource={record?.options || []}
                />
              </>
            );
          }}
        />
        <Button
          disabled={isEditing}
          dashed
          onClick={() => handleAddRow()}
          fullWidth
          icon={<AiOutlinePlusCircle />}
        >
          Add Item
        </Button>
      </div>
    </main>
  );
}
const initialValues = {
  name: "",
  category: "",
  options: [],
  price: 0,
  cost: 0,
  qty: 0,
  id: null,
};
function removeExtraSpaces(str: string) {
  str = str.trim();
  str = str.replace(/\s{2,}/g, " ");
  return str;
}
