import React from "react";
import { sectionNameType, fieldsNameType } from "../../components/aclsFields";
import { TextField } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

export default <SecName extends sectionNameType>({
  name,
  value,
  handleDelField,
  handleSaveFieldChange,
}: {
  name: string;
  value: string;
  handleDelField: (key: fieldsNameType<SecName>) => void;
  handleSaveFieldChange: (value: string, key: fieldsNameType<SecName>) => void;
}) => {
  // const [value, setValue] = useState(initialValue);

  return (
    <div className="propBox" key={name}>
      <div className="propField propKey">
        <div>{name}</div>
      </div>
      <div
        className="propField propValue"
        onMouseDown={
          (e) => e.stopPropagation() // prevent the draging whan selecting text
        }
      >
        <TextField
          type="text"
          value={value}
          className="inputField"
          placeholder="Enter Value..."
          onChange={(e) => handleSaveFieldChange(e.target.value, name as any)}
          style={{ fontSize: "0.9em" }}
        />
      </div>
      <DeleteOutlinedIcon
        titleAccess="Delete this field"
        fontSize={"large"}
        className="button addButton"
        onClick={() => handleDelField(name as fieldsNameType<SecName>)}
      />
    </div>
  );
};
