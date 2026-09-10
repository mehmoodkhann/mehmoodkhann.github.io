import AdminListEditor from "../../components/admin/AdminListEditor";
import { servicesService } from "../../services/servicesService";
import { expertiseService } from "../../services/expertiseService";
export default function Services() {
  return (
    <div className="space-y-16">
      <AdminListEditor
        title="Services"
        description="Client-facing services on the home page and Services page."
        service={servicesService}
        columns={[
          { key: "title", label: "Service" },
          { key: "items", label: "Technologies" },
        ]}
        fields={[
          { name: "title", label: "Service title", type: "text" },
          { name: "problem", label: "Client problem", type: "textarea" },
          { name: "solution", label: "What I can build", type: "textarea" },
          { name: "value", label: "Practical value", type: "textarea" },
          {
            name: "items",
            label: "Technologies (comma-separated)",
            type: "list",
          },
        ]}
      />
      <AdminListEditor
        headingLevel={2}
        title="Expertise areas"
        description="The grouped engineering toolkit on the home page. Existing expertise content is preserved here."
        service={expertiseService}
        columns={[
          { key: "title", label: "Category" },
          { key: "items", label: "Items" },
        ]}
        fields={[
          { name: "title", label: "Category title", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "items", label: "Items", type: "list" },
        ]}
      />
    </div>
  );
}
