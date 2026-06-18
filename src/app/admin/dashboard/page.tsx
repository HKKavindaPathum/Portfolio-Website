import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const auth = await verifyAuth();

  if (!auth) {
    redirect('/backdoor-admin');
  }

  return <DashboardClient />;
}
