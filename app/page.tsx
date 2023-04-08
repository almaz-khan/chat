import Button from "@/components/ui/Button";
import { db } from "@/lib/db";
import { FC } from "react";

interface HomeProps {}

const Home = async () => {
  await db.set("hello", "hello");
  return <Button size="lg" />;
};

export default Home;
