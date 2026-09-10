import AdminListEditor from "../../components/admin/AdminListEditor";
import { skillsService } from "../../services/skillsService";
import { skillLevelOrder } from "../../data/defaultData";

export default function Skills() {
  return (
    <AdminListEditor
      title="Skills"
      description="Grouped by category. Levels are categorical, not fabricated percentages."
      service={skillsService}
      emptyLabel="No skills added yet"
      columns={[
        { key: "name", label: "Skill" },
        { key: "category", label: "Category" },
        { key: "level", label: "Level" },
      ]}
      fields={[
        {
          name: "name",
          label: "Skill name",
          type: "text",
          placeholder: "e.g. Retrieval-Augmented Generation",
        },
        {
          name: "category",
          label: "Category",
          type: "text",
          placeholder: "e.g. RAG / LLM",
        },
        {
          name: "level",
          label: "Level",
          type: "select",
          options: skillLevelOrder,
        },
      ]}
    />
  );
}
