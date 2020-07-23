import React, { useContext } from "react";
import { CanvasContext } from "../../SwitchView";
import { flowType } from "../../../../utils/serverRequests";
import { sectionNameType, fieldsType, fieldsNameType } from "../../components/aclsFields";
import PopUpMenu from "./PopUpMenu";
import InputField from "./InputField";

export default <SecName extends sectionNameType>({
  sectionName,
  fields,
  details,
  setDetails,
}: {
  sectionName: SecName;
  fields: fieldsType<SecName>;
  // details: BoxType["modData"][SecName];
  details: flowType[SecName];
  setDetails: React.Dispatch<React.SetStateAction<flowType[SecName]>>;
}) => {
  type fieldName = fieldsNameType<SecName>;

  const handleAddField = (key: fieldName) => {
    setDetails({ ...Object.assign(details, { [key]: "" }) });
  };

  // useEffect(() => {}, [details]);

  const handleDelField = (key: fieldName) => {
    setDetails((details) => {
      // key = "OUTPUT";
      // newDetails.
      const newDetails = { ...details };
      // newDetails.
      delete (newDetails as any)[key];
      return newDetails;
    });
  };

  const handleSaveFieldChange = (value: string, key: fieldName) => {
    setDetails({ ...Object.assign(details, { [key]: value }) });
  };

  return (
    <div className="section">
      <PopUpMenu handleAddField={handleAddField} fields={fields} secName={sectionName} />
      <div className="sectionHeader">{sectionName}:</div>
      {Object.keys(details).map((key) => (
        <InputField
          {...{
            key,
            name: key,
            value: (details as any)[key],
            handleDelField,
            handleSaveFieldChange,
          }}
        />
      ))}
    </div>
  );
};
