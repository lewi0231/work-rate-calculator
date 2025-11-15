import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props =
  | {
      handleAddWorker?: (name: string) => void;
      handleAddCarYard: (name: string) => void;
    }
  | {
      handleAddWorker: (name: string) => void;
      handleAddCarYard?: (name: string) => void;
    };

function AddNameField({ handleAddWorker, handleAddCarYard }: Props) {
  const [name, setName] = useState("");
  const isWorker = !!handleAddWorker;
  return (
    <div className=" flex divide-y gap-6 w-full justify-center py-6 ">
      <Input
        placeholder="Name"
        className="flex-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        size="lg"
        variant="default"
        className="flex-1 cursor-pointer"
        onClick={(e) => {
          isWorker ? handleAddWorker(name) : handleAddCarYard(name);
          setName("");
        }}
      >
        <Plus />
        <span>{isWorker ? "Worker" : "Car Yard"}</span>
      </Button>
    </div>
  );
}

export default AddNameField;
