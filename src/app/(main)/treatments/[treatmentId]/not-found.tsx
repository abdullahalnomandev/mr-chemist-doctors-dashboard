import { NotFoundMessage } from "@/components/ui/data-result-message";

export default function NotFoundPage() {
  return (
    <NotFoundMessage
      size="lg"
      trackPath="/treatments"
      message="The data you are looking for might not exist."
    />
  );
}
