"use client";

import { useState } from "react";
import { UserSettings } from "@prisma/client";
import { Save, Loader2, Target, Flame, Apple, Moon } from "lucide-react";
import { updateUserSettings } from "@/actions/nutrition";
import { useRouter } from "next/navigation";

export function SettingsForm({ initialSettings }: { initialSettings: UserSettings | null }) {
  const [settings, setSettings] = useState({
    dailyCalories: initialSettings?.dailyCalories || 2000,
    dailyProtein: initialSettings?.dailyProtein || 150,
    dailyCarbs: initialSettings?.dailyCarbs || 200,
    dailyFat: initialSettings?.dailyFat || 65,
    targetBedtime: initialSettings?.targetBedtime || "22:00",
    targetWakeTime: initialSettings?.targetWakeTime || "06:00",
    targetSleepDuration: initialSettings?.targetSleepDuration || 8,
  });
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserSettings(settings);
      router.refresh();
    } catch (error) {
      console.error("Failed to update settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
          <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass">
            <h3 className="heading-4 text-dark mb-6 flex items-center gap-2">
              <Apple size={20} className="text-sage" />
              Nutrition Goals
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray mb-1.5 text-sage">Daily Calories</label>
                <input
                  type="number"
                  value={settings.dailyCalories}
                  onChange={(e) => setSettings({ ...settings, dailyCalories: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray mb-1.5 text-sage-dark">Daily Protein (g)</label>
                <input
                  type="number"
                  value={settings.dailyProtein}
                  onChange={(e) => setSettings({ ...settings, dailyProtein: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray mb-1.5 text-gold">Daily Carbs (g)</label>
                <input
                  type="number"
                  value={settings.dailyCarbs}
                  onChange={(e) => setSettings({ ...settings, dailyCarbs: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray mb-1.5 text-coral">Daily Fat (g)</label>
                <input
                  type="number"
                  value={settings.dailyFat}
                  onChange={(e) => setSettings({ ...settings, dailyFat: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass">
             <h3 className="heading-4 text-dark mb-6 flex items-center gap-2">
              <Moon size={20} className="text-indigo-500" />
              Sleep & Recovery
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray mb-1.5 text-indigo-500">Target Bedtime</label>
                <input
                  type="time"
                  value={settings.targetBedtime}
                  onChange={(e) => setSettings({ ...settings, targetBedtime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray mb-1.5 text-sky-500">Target Wake Time</label>
                <input
                  type="time"
                  value={settings.targetWakeTime}
                  onChange={(e) => setSettings({ ...settings, targetWakeTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray mb-1.5 text-lavender">Target Duration (hrs)</label>
                <input
                  type="number"
                  min="4"
                  max="14"
                  value={settings.targetSleepDuration}
                  onChange={(e) => setSettings({ ...settings, targetSleepDuration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-lavender/20 focus:border-lavender transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-sage text-white rounded-xl font-bold hover:bg-sage-dark transition-all shadow-lg shadow-sage/20 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
  );
}
