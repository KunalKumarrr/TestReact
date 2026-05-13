import WelcomeBox from "@/components/WelcomeBox";
import SubjectBox from "@/components/SubjectBox";
import ChannelBox from "@/components/ChannelBox";
import { db } from "@/db";
import { topics } from "@/db/schema";

// Force the page to fetch fresh progress every time it loads
export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Calculate Days Left for GATE
  const targetDate = new Date("2027-02-06");
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // 2. Fetch live progress from the Neon database
  const allTopics = await db.select().from(topics);
  const totalTopics = allTopics.length;
  const completedTopics = allTopics.filter(t => t.isCompleted).length;
  const overallProgress = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

  return (
    <div className="container flex flex-col items-center justify-center gap-12 mt-6 md:mt-10 w-full">
      
      {/* Master Progress Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4 md:px-0">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col items-center justify-center">
          <h2 className="text-lg font-medium text-muted-foreground mb-2">Days Until GATE</h2>
          <div className="text-5xl font-black text-primary">{daysLeft}</div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-center gap-4">
          <div className="flex justify-between items-end">
            <h2 className="text-lg font-medium text-muted-foreground">Syllabus Completion</h2>
            <span className="text-2xl font-bold text-green-500">{overallProgress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-right text-muted-foreground">{completedTopics} / {totalTopics} Topics Completed</p>
        </div>
      </div>

      {/* Your original theme components */}
      <WelcomeBox />
      <SubjectBox />
      <ChannelBox />
    </div>
  );
}