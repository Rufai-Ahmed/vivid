import { Button } from "@/components/ui/button";
import { Plane, Ticket, Trophy } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const QuickActions = () => {
  return (
    <div className="hidden sm:block mt-8 p-6 rounded-2xl border border-border bg-card">
      <h2 className="font-semibold mb-4">Quick Actions</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/dashboard/redeem">
          <Button
            variant="outline"
            className="w-full h-auto py-4 flex-col gap-2"
          >
            <Ticket className="w-6 h-6" />
            <span>Redeem Ticket</span>
          </Button>
        </Link>
        <Link to="/dashboard/visa">
          <Button
            variant="outline"
            className="w-full h-auto py-4 flex-col gap-2"
          >
            <Plane className="w-6 h-6" />
            <span>Apply for Visa</span>
          </Button>
        </Link>
        <Link to="/dashboard/world-cup">
          <Button
            variant="outline"
            className="w-full h-auto py-4 flex-col gap-2"
          >
            <Trophy className="w-6 h-6" />
            <span>World Cup Bets</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
