import BigStatsCard from "./big-stats-card";
import TechStackCard from "./tech-stack-card";
import StatusCard from "./status-card";

export default function BentoGrid() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(200px,auto)]">
        <BigStatsCard />
        <TechStackCard />
        <StatusCard />
      </div>
    </div>
  );
}
