import React, { useState } from "react";
import { sectionNameType, fieldsType, fieldsNameType } from "../../components/aclsFields";
import Popup from "reactjs-popup";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";

export default <SecName extends sectionNameType>({
  handleAddField,
  fields,
  secName,
}: {
  fields: fieldsType<SecName>;
  handleAddField: (key: fieldsNameType<SecName>) => void;
  secName: SecName;
}) => {
  const [filterField, setFilterField] = useState("");

  fields = fields
    ? filterField
      ? (fields as any).filter((f: fieldsType<SecName>[number]) => f[0].includes(filterField))
      : fields
    : [];

  return (
    <Popup
      trigger={
        <div className="button addButton">
          <AddOutlinedIcon fontSize={"large"} />
        </div>
      }
      position="right top"
      on="hover"
      closeOnDocumentClick
      mouseLeaveDelay={400}
      mouseEnterDelay={0}
      contentStyle={{ border: "none", width: 200, transition: "all 1s ease-out" }}
      arrow={true}
    >
      <div>
        <input
          value={filterField}
          type="text"
          style={{ width: 100, border: "none", fontSize: "0.9em" }}
          placeholder="filter..."
          onChange={(e) => setFilterField(e.target.value)}
        />
        <div className="popupMenu">
          {(fields as any).map((field: fieldsType<SecName>[number]) => (
            <Popup
              key={field[0]}
              trigger={
                <div key={field[0]} className="menu-item" onClick={() => handleAddField(field[0])}>
                  {field[0]}
                </div>
              }
              position="right top"
              on="hover"
              mouseLeaveDelay={200}
              mouseEnterDelay={200}
              contentStyle={{ border: "none", width: 200 }}
              arrow={true}
            >
              <Popup
                key={field[0]}
                trigger={<div>{field[1]}</div>}
                position="top center"
                on="hover"
                mouseLeaveDelay={0}
                mouseEnterDelay={0}
                contentStyle={{ border: "none", width: 200 }}
                arrow={true}
              >
                {field[2] as any}
              </Popup>
            </Popup>
          ))}
        </div>
      </div>
    </Popup>
  );
};
