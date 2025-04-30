import type React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 relative overflow-hidden bg-white hover:bg-amber-400 border group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 group-hover:text-white/80 transition-colors duration-300">
              {title}
            </p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900 group-hover:text-white transition-colors duration-300">
              {value}
            </h3>
          </div>
          <div className="flex items-center justify-center w-10 h-10 text-gray-500 group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
