import AdminIncomeDetailContent from "@/features/admin-income/components/AdminIncomeDetailContent";

export default async function AdminIncomeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AdminIncomeDetailContent incomeId={Number(id)} />;
}
