"use client";
import TableEditable from "@/components/TableEditable";
import useFireBase from "@/hooks/useFireBase";
import { useEffect, useState } from "react";
import { uuid } from "uuidv4";
import { ColumnT, MenuItem, Option } from "./types/types";
import Input from "@/components/Input";
import Select from "@/components/Select";
type Filters = {
  search: string;
  categories: string[];
};
export default function Home() {
  const [readData, writeData, updateData, loading] = useFireBase();
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredDataSource, setFilteredDataSource] = useState<MenuItem[]>([]);
  const [dataSource, setDataSource] = useState<MenuItem[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    categories: [],
  });

  const handleSearch = () => {
    setFilteredDataSource(
      dataSource?.filter((item) => {
        if (filters.categories.length === 0) {
          return item.name.toLowerCase().includes(filters.search.toLowerCase());
        }
        return (
          item.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          filters.categories.includes(item.category)
        );
      })
    );
  };

  useEffect(
    () => handleSearch(),
    [filters.search, filters.categories, dataSource]
  );
  const submitMenuItem = async (rowData: any) => {
    let data = { ...rowData };
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
  };

  const handleSaveMenuItemCell = async (cellData: any) => {
    await writeData<MenuItem>(
      `menu/items/${cellData?.id}/${cellData?.key}`,
      cellData?.value,
      async () => {
        fetchMenuItems();
        alert("Menu item successfully saved!");
      }
    );
  };

  const fetchMenuItems = async () => {
    const data = await readData("menu/items");
    setFilteredDataSource(data);
    setDataSource(data);
  };

  const handleDeleteItem = async (id: string) => {
    await writeData<null>(`menu/items/${id}`, null, () => {
      alert("Menu item successfully deleted!");
      fetchMenuItems();
    });
  };

  const handleSaveOption = async (rowData: any) => {
    await writeData<any>(
      `menu/items/${rowData?.menuItemId}/options/${rowData?.id || uuid()}`,
      rowData,
      async () => {
        alert(`Menu item successfully ${rowData?.id ? "update" : "saved"}!`);
        fetchMenuItems();
      }
    );
  };
  const handleSaveOptionCell = async (cellData: any) => {
    await writeData<any>(
      `menu/items/${cellData?.record?.menuItemId}/options/${
        cellData?.id || uuid()
      }/${cellData?.key}`,
      cellData?.value,
      async () => {
        alert(`Menu item successfully ${cellData?.id ? "update" : "saved"}!`);
        fetchMenuItems();
      }
    );
  };
  const handleDeleteOption = async (id: string) => {};
  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const arr = Array.from(new Set(dataSource?.map((item) => item.category)));
    setCategories(arr);
  }, [dataSource]);

  const expandedColumns: ColumnT<Option>[] = [
    {
      dataIndex: "name",
      title: "Name",
      renderOptions: {
        key: "name",
        inputType: "text",
      },
    },
    {
      dataIndex: "additionalCost",
      title: "Additional Cost",
      renderOptions: {
        key: "additionalCost",
        inputType: "number",
        formatNumber: true,
      },
    },
  ];

  const columns: ColumnT<MenuItem>[] = [
    {
      dataIndex: "name",
      title: "Name",
      renderOptions: {
        key: "name",
        inputType: "text",
      },
    },
    {
      dataIndex: "category",
      title: "Category",
      renderOptions: {
        key: "category",
        inputType: "text",
        categories: categories,
      },
    },
    {
      dataIndex: "price",
      title: "Price",
      width: "150px",
      renderOptions: {
        key: "price",
        inputType: "number",
        formatNumber: true,
      },
    },
    {
      dataIndex: "cost",
      title: "Cost",
      width: "150px",
      renderOptions: {
        key: "cost",
        inputType: "number",
        formatNumber: true,
      },
    },
    {
      dataIndex: "qty",
      title: "Quantity",
      width: "150px",
      renderOptions: {
        key: "qty",
        inputType: "number",
      },
    },
  ];
  return (
    <main className="flex min-h-screen flex-col  justify-between p-10">
      <div>
        <div className="text-xl font-bold mb-10">Restaurant Menu</div>
        <div className="flex">
          <div className="mb-4 mr-2">Search:</div>
          <Input
            onChange={(e) => {
              console.log(e.target.value);
              setFilters({ ...filters, search: e.target.value });
            }}
          />

          <div className="mb-4 mr-2 ml-10">Categories:</div>
          <Select
            options={categories}
            onChange={(value: string[]) => {
              setFilters({ ...filters, categories: value as string[] });
            }}
          />
        </div>

        <TableEditable
          initialValues={initialValues}
          dataSource={filteredDataSource}
          columns={columns}
          addButtonText="New Menu Item"
          onSaveRow={submitMenuItem}
          onSaveCell={handleSaveMenuItemCell}
          onDeleteRow={handleDeleteItem}
          expandedRowRender={(record: MenuItem) => {
            return (
              <div className="ml-[50px]">
                <div className="font-bold"> {record?.name} Options</div>
                <TableEditable
                  initialValues={{
                    name: "",
                    additionalCost: 0,
                    menuItemId: record?.id,
                  }}
                  columns={expandedColumns}
                  dataSource={
                    record?.options
                      ? Object?.keys(record?.options).map((key) => ({
                          ...(record.options[
                            key as keyof typeof record.options
                          ] as Option),
                          menuItemId: record?.id,
                          id: key,
                        }))
                      : []
                  }
                  addButtonText={`New ${record?.name} Option`}
                  onSaveRow={handleSaveOption}
                  onSaveCell={handleSaveOptionCell}
                  onDeleteRow={handleDeleteOption}
                  loading={false}
                  expandedRowRender={undefined}
                />
              </div>
            );
          }}
          loading={loading}
        />
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
