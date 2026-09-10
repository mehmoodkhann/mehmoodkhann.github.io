import AdminListEditor from "../../components/admin/AdminListEditor";
import { certificationsService } from "../../services/certificationsService";

export default function Certifications() {
  return (
    <AdminListEditor
      title="Certifications"
      description="Add completed credentials only. Saved certificates appear on the public page in this browser."
      service={certificationsService}
      emptyLabel="No certifications added yet"
      columns={[
        { key: "name", label: "Certification" },
        { key: "issuer", label: "Issuer" },
        { key: "issueDate", label: "Issued" },
      ]}
      fields={[
        {
          name: "name",
          label: "Certification name",
          type: "text",
          required: true,
        },
        {
          name: "issuer",
          label: "Issuing organization",
          type: "text",
          required: true,
        },
        { name: "issueDate", label: "Issue date (optional)", type: "date" },
        {
          name: "credentialId",
          label: "Credential ID (optional)",
          type: "text",
        },
        {
          name: "credentialUrl",
          label: "Credential URL (optional)",
          type: "url",
        },
        { name: "image", label: "Certificate image (optional)", type: "image" },
        {
          name: "skills",
          label: "Skills / technologies learned (comma-separated)",
          type: "list",
        },
      ]}
    />
  );
}
