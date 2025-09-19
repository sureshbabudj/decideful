"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { useDecisionsStore } from "@/lib/store/decisions-store";
import { DecisionList } from "@/components/decisions/decision-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Decision } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function DecisionsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { decisions, setDecisions, setLoading } = useDecisionsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "decisions"),
      where("userId", "==", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const decisionsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        reviewDate: doc.data().reviewDate.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      }));

      setDecisions(decisionsData as Decision[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, setDecisions, setLoading]);

  const filteredDecisions = decisions.filter((decision) => {
    const matchesSearch = decision.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && decision.reviewed) ||
      (filter === "pending" && !decision.reviewed);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold text-foreground/90 ">
          My Decisions
        </h1>
        <Button onClick={() => router.push("/decisions/new")}>
          <Plus className="md:mr-2 h-4 w-4" />
          <span className="hidden md:inline">New Decision</span>
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Search decisions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-border rounded-md focus:ring-primary-foreground focus:border-primary-foreground"
        />
        <Select
          onValueChange={(value) => setFilter(value)}
          defaultValue={filter}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Decisions</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DecisionList decisions={filteredDecisions} />
    </div>
  );
}
