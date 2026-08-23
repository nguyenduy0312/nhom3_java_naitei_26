import BudgetTemplateForm from "@/features/budget-template/BudgetTemplateForm";

export default async function EditBudgetTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BudgetTemplateForm mode="edit" id={id} />;
}
