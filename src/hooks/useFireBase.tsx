import { initializeApp } from "firebase/app";
import {
  child,
  get,
  getDatabase,
  orderByChild,
  orderByValue,
  query,
  ref,
  set,
  update,
} from "firebase/database";
import { useState } from "react";
const firebaseConfig = {
  apiKey: "AIzaSyB2bCAgE601F1u0RrrN4X-wQ0ZCIzw9GTs",
  authDomain: "test-13bcb.firebaseapp.com",
  projectId: "test-13bcb",
  storageBucket: "test-13bcb.appspot.com",
  messagingSenderId: "65967022092",
  appId: "1:65967022092:web:a0e5e7c70ccfa59202ce29",
  measurementId: "G-GFF8BHGNRZ",
  databaseURL:
    "https://test-13bcb-default-rtdb.asia-southeast1.firebasedatabase.app",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
function useFireBase(): FirebaseHookReturnType {
  const [loading, setLoading] = useState<boolean>(false);

  const writeData: WriteDataFunction = async (path, value, callback) => {
    setLoading(true);
    set(ref(database, path), value)
      .then(() => {
        if (callback) callback();
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error writing data: ", error);
        setLoading(false);
      });
  };

  const updateData: UpdateDataFunction = async (value, callback) => {
    setLoading(true);
    return update(ref(database), value)
      .then(() => {
        if (callback) callback();
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error writing data: ", error);
        setLoading(false);
      });
  };

  const readData: ReadDataFunction = async (path, callback) => {
    setLoading(true);
    return get(query(ref(database, path), orderByChild("name")))
      .then((snapshot) => {
        setLoading(false);
        if (snapshot.exists()) {
          if (callback) callback();
          let res: any = [];
          snapshot.forEach((item) => {
            let obj = item.val();
            res.push({ ...obj, id: item.key });
          });
          return res;
        } else {
          console.log("No data available");
          return null;
        }
      })
      .catch((error) => {
        console.error("Error reading data: ", error);
        setLoading(false);
        throw error;
      });
  };
  return [readData, writeData, updateData, loading];
}

// ----------------------------------------------- types & interfaces -----------------------------------------------
type ReadDataFunction = (path: string, callback?: () => void) => Promise<any>;
type WriteDataFunction = <T>(
  path: string,
  value: T,
  callback?: () => void
) => Promise<void>;

type UpdateDataFunction = (
  value: object,
  callback?: () => void
) => Promise<void>;
type FirebaseHookReturnType = [
  ReadDataFunction,
  WriteDataFunction,
  UpdateDataFunction,
  boolean
];
export default useFireBase;
