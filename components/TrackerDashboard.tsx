"use client";

import { useState, useTransition } from "react";
import { 
  createSubject, deleteSubject, 
  createTopic, toggleTopic, deleteTopic, 
  createGoal, toggleGoal, deleteGoal 
} from "@/app/actions";

type Topic = { id: string; name: string; isCompleted: boolean };
type Subject = { id: string; name: string; topics: Topic[] };
type Goal = { id: string; monthTarget: string; description: string; isCompleted: boolean };

interface TrackerProps {
  subjects: Subject[];
  goals: Goal[];
  daysLeft: number;
}

export default function TrackerDashboard({ subjects, goals, daysLeft }: TrackerProps) {
  const [isPending, startTransition] = useTransition();
  const [newSubject, setNewSubject] = useState("");
  const [newTopicInputs, setNewTopicInputs] = useState<Record<string, string>>({});
  const [goalMonth, setGoalMonth] = useState("");
  const [goalDesc, setGoalDesc] = useState("");

  // --- Calculations ---
  let totalTopics = 0;
  let completedTopics = 0;
  subjects.forEach(sub => {
    totalTopics += sub.topics.length;
    completedTopics += sub.topics.filter(t => t.isCompleted).length;
  });
  const overallProgress = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

  // --- Handlers ---
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject) return;
    startTransition(() => { createSubject(newSubject); });
    setNewSubject("");
  };

  const handleAddTopic = (subjectId: string) => {
    const name = newTopicInputs[subjectId];
    if (!name) return;
    startTransition(() => { createTopic(subjectId, name); });
    setNewTopicInputs({ ...newTopicInputs, [subjectId]: "" });
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalMonth || !goalDesc) return;
    startTransition(() => { createGoal(goalMonth, goalDesc); });
    setGoalMonth("");
    setGoalDesc("");
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-8">
      
      {/* Master Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col items-center justify-center">
          <h2 className="text-lg font-medium text-slate-500 mb-2">Days Until GATE</h2>
          <div className="text-5xl font-black text-blue-600">{daysLeft}</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col justify-center gap-4">
          <div className="flex justify-between items-end">
            <h2 className="text-lg font-medium text-slate-500">Syllabus Completion</h2>
            <span className="text-2xl font-bold text-emerald-500">{overallProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
            <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${overallProgress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Goals */}
        <section className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Monthly Objectives</h2>
          
          <form onSubmit={handleAddGoal} className="flex flex-col gap-2 mb-6">
            <input type="month" value={goalMonth} onChange={(e) => setGoalMonth(e.target.value)} required
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="text" placeholder="e.g., Finish OS basics..." value={goalDesc} onChange={(e) => setGoalDesc(e.target.value)} required
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <button type="submit" disabled={isPending} className="bg-slate-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition disabled:opacity-50">
              Deploy Goal
            </button>
          </form>

          <ul className="space-y-3">
            {goals.map(goal => (
              <li key={goal.id} className={`flex items-start gap-3 p-3 rounded-lg border transition ${goal.isCompleted ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 shadow-sm'}`}>
                <input type="checkbox" checked={goal.isCompleted} onChange={() => startTransition(() => toggleGoal(goal.id, !goal.isCompleted))} 
                  className="mt-1 w-4 h-4 text-blue-600 rounded cursor-pointer" />
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-1 rounded">{goal.monthTarget}</span>
                  <p className={`text-sm mt-2 font-medium ${goal.isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{goal.description}</p>
                </div>
                <button onClick={() => startTransition(() => deleteGoal(goal.id))} className="text-red-300 hover:text-red-500 text-lg leading-none">&times;</button>
              </li>
            ))}
          </ul>
        </section>

        {/* Subjects & Topics */}
        <section className="lg:col-span-2">
          <form onSubmit={handleAddSubject} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 flex gap-3">
            <input type="text" placeholder="New Subject Name (e.g., Computer Networks)" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} required
              className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            <button type="submit" disabled={isPending} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50">
              Add Subject
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.map(subject => {
              const subTotal = subject.topics.length;
              const subCompleted = subject.topics.filter(t => t.isCompleted).length;
              const subPercent = subTotal === 0 ? 0 : Math.round((subCompleted / subTotal) * 100);

              return (
                <div key={subject.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition h-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-900">{subject.name}</h3>
                    <button onClick={() => { if(confirm('Delete subject completely?')) startTransition(() => deleteSubject(subject.id)); }} className="text-slate-300 hover:text-red-500 text-xl leading-none">&times;</button>
                  </div>
                  
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-1 overflow-hidden">
                    <div className="bg-emerald-500 h-2 transition-all duration-500" style={{ width: `${subPercent}%` }}></div>
                  </div>
                  <div className="text-xs text-right text-slate-500 font-bold mb-4">{subPercent}%</div>

                  <ul className="space-y-2 flex-1 mb-4">
                    {subject.topics.map(topic => (
                      <li key={topic.id} className="flex justify-between items-center gap-2 text-sm p-1 rounded hover:bg-slate-50 group">
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                          <input type="checkbox" checked={topic.isCompleted} onChange={() => startTransition(() => toggleTopic(topic.id, !topic.isCompleted))}
                            className="w-4 h-4 text-emerald-500 rounded border-slate-300 cursor-pointer" />
                          <span className={topic.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}>
                            {topic.name}
                          </span>
                        </label>
                        <button onClick={() => startTransition(() => deleteTopic(topic.id))} className="text-red-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">&times;</button>
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100">
                    <input type="text" placeholder="Add topic..." value={newTopicInputs[subject.id] || ''} 
                      onChange={(e) => setNewTopicInputs({...newTopicInputs, [subject.id]: e.target.value})}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTopic(subject.id)}
                      className="flex-1 text-sm border border-slate-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                    <button onClick={() => handleAddTopic(subject.id)} disabled={isPending} className="bg-slate-100 text-slate-600 px-3 py-2 rounded text-sm font-bold hover:bg-slate-200 transition disabled:opacity-50">+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}