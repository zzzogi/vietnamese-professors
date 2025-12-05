import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDeleteEmail } from "@/hooks/use-delete-email";
import toast from "react-hot-toast";

interface EmailDraftCardProps {
  email: {
    id: string;
    professorId: string;
    subject: string;
    content: string;
    createdAt: string;
    professor: {
      id: string;
      name: string;
      email: string;
      university: string;
      imageUrl: string | null;
    };
  };
}

export function EmailDraftCard({ email }: EmailDraftCardProps) {
  const { mutate: deleteEmail, isPending } = useDeleteEmail();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `Subject: ${email.subject}\n\n${email.content}`
      );
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this email draft?")) {
      deleteEmail(email.id);
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <Link href={`/professors/${email.professorId}`}>
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 cursor-pointer">
            {email.professor.imageUrl ? (
              <Image
                src={email.professor.imageUrl}
                alt={email.professor.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-400">
                {email.professor.name.charAt(0)}
              </div>
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            href={`/professors/${email.professorId}`}
            className="font-semibold text-gray-900 hover:text-purple-600 truncate block"
          >
            {email.professor.name}
          </Link>
          <p className="text-sm text-gray-600 truncate">{email.subject}</p>
        </div>

        <span className="text-xs text-gray-500 flex-shrink-0">
          {new Date(email.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="text-sm text-gray-700 line-clamp-2 mb-3">{email.content}</p>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex-1"
        >
          <Copy className="w-3 h-3 mr-1" />
          Copy
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
