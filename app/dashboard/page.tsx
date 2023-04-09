import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { FC } from "react";

interface DashboardProps {}

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  return <pre>{JSON.stringify(session?.user)}</pre>;
};

export default Dashboard;
