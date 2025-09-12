import { getAuthenticatedUser } from "@/lib/auth/server";
import { adminDb } from "@/lib/firebase/admin";
import { snapsToTyped } from "@/lib/firebase/utils";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  CircleCheckBig,
  CircleEllipsis,
  FileX2,
  MessageSquareCode,
} from "lucide-react";
import Link from "next/link";
import { Decision } from "@/types";
import { decisionSchema } from "@/types/transformSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DecisionsPage() {
  const user = await getAuthenticatedUser();
  if (!user) return redirect("/login");

  const snap = await adminDb
    .collection("users")
    .doc(user.uid)
    .collection("decisions")
    .orderBy("updatedAt", "desc")
    .get();

  const decisions: Decision[] = snapsToTyped(snap.docs, decisionSchema);

  const toBeReviewed = decisions.filter(
    (decision) => new Date(decision.reviewDate) >= new Date()
  );

  return (
    <div className="p-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold  mb-2">Decisions</h1>
          <p className="text-muted-foreground">
            Track your reasoning, expected outcomes, and actual results.
          </p>
        </div>
        {toBeReviewed.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Due for Review</h2>
            <div className="space-y-4">
              {toBeReviewed.map((decision) => (
                <Link
                  href={`/decisions/${decision.id}`}
                  key={decision.id}
                  className="bg-accent rounded-md p-6 flex items-center justify-between hover:bg-primary/10 transition-colors"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{decision.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created{" "}
                      {formatDistanceToNow(decision.createdAt, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <button className="flex items-center justify-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium hover:bg-primary-600 transition-colors">
                    <MessageSquareCode className="h-5 w-5" />
                    <span>Review</span>
                  </button>
                </Link>
              ))}
            </div>
          </div>
        )}
        {decisions.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">All Decisions</h2>
            <div className="divide-y divide-border">
              {decisions.map((decision) => (
                <Link
                  href={`/decisions/${decision.id}`}
                  key={decision.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-lg font-medium ">{decision.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created{" "}
                      {formatDistanceToNow(decision.createdAt, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {new Date(decision.reviewDate) <= new Date() ? (
                    <div className="flex items-center gap-2 text-primary">
                      <CircleCheckBig className="w-5 h-5 text-xl" />
                      <span className="text-sm font-medium">Reviewed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-orange-400">
                      <CircleEllipsis className="w-5 h-5 text-xl" />
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">
                <h2 className="text-2xl font-bold mb-4">No Decisions Yet</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <FileX2 className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground mb-6">
                  You haven&apos;t logged any decisions yet. Start by creating a
                  new decision to track your important choices and their
                  outcomes.
                </p>
                <Button asChild>
                  <Link
                    href="/decisions/new"
                    className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium hover:bg-primary-600 transition-colors"
                  >
                    <MessageSquareCode className="h-5 w-5" />
                    <span>Log Your First Decision</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
