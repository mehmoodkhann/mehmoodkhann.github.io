import AdminListEditor from "../../components/admin/AdminListEditor";
import { educationService } from "../../services/educationService";

export default function Education() {
  return (
    <AdminListEditor
      title="Education"
      description="Degrees and institutions shown on the public Journey page."
      service={educationService}
      emptyLabel="No education entries yet"
      columns={[
        { key: "degree", label: "Degree" },
        { key: "institution", label: "Institution" },
        { key: "period", label: "Period" },
      ]}
      fields={[
        {
          name: "degree",
          label: "Degree",
          type: "text",
          placeholder: "e.g. BS Computer Science",
        },
        { name: "institution", label: "Institution", type: "text" },
        {
          name: "period",
          label: "Period",
          type: "text",
          placeholder: "e.g. Expected graduation: 2027",
        },
        {
          name: "description",
          label: "Description (optional)",
          type: "textarea",
        },
      ]}
    />
  );
}
