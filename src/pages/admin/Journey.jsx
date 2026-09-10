import AdminListEditor from "../../components/admin/AdminListEditor";
import { journeyService } from "../../services/journeyService";

export default function Journey() {
  return (
    <AdminListEditor
      title="Journey"
      description="The timeline shown on the public Journey page, in order added."
      service={journeyService}
      emptyLabel="No journey items yet"
      columns={[
        { key: "title", label: "Title" },
        { key: "period", label: "Period" },
      ]}
      fields={[
        {
          name: "title",
          label: "Title",
          type: "text",
          placeholder: "e.g. Retrieval-Augmented Generation",
        },
        {
          name: "period",
          label: "Period (optional)",
          type: "text",
          placeholder: "e.g. Currently exploring",
        },
        { name: "description", label: "Description", type: "textarea" },
      ]}
    />
  );
}
