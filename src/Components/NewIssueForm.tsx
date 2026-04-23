import { useState } from "react";
import type { ChangeEvent, FormEventHandler } from "react";
import type { User } from "firebase/auth";

interface NewIssueFormProps {
  handleSubmit: FormEventHandler<HTMLFormElement>;
  user: User | null;
  isUploading: boolean;
  selectedFileName: string;
  previewUrl: string | null;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const NewIssueForm = ({
  handleSubmit,
  user,
  isUploading,
  selectedFileName,
  previewUrl,
  onImageChange,
}: NewIssueFormProps) => {
  const [selectedLevel, setSelectedLevel] = useState<"Low" | "Medium" | "High">("Low");

  return (
    <div className="card mx-auto max-w-4xl overflow-hidden rounded-3xl border border-base-200 bg-base-100 shadow-sm sm:rounded-[3rem]">
      <div className="card-body p-4 sm:p-6 md:p-12">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 text-secondary sm:gap-6 md:grid-cols-2 md:gap-8">
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-bold">Issue Title</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Large garbage pile near West Park entrance"
              className="input input-bordered input-lg w-full rounded-2xl border-transparent bg-base-200/50 font-medium transition-all focus:input-primary focus:bg-base-100"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Category</span>
            </label>
            <select
              name="category"
              className="select select-bordered select-lg w-full rounded-2xl border-transparent bg-base-200/50 font-medium transition-all focus:select-primary focus:bg-base-100"
            >
              <option>Garbage</option>
              <option>Illegal Construction</option>
              <option>Broken Public Property</option>
              <option>Road Damage</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Location</span>
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g. 123 Street, City Name"
              className="input input-bordered input-lg w-full rounded-2xl border-transparent bg-base-200/50 font-medium transition-all focus:input-primary focus:bg-base-100"
              required
            />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-bold">Issue Image</span>
            </label>
            <input type="hidden" name="image" value={selectedFileName} readOnly />
            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/20 bg-base-200/40 p-4 text-center transition-all hover:border-primary/40 hover:bg-base-200/60 sm:min-h-44 sm:p-6">
              <span className="text-base font-bold text-secondary sm:text-lg">
                {selectedFileName ? "Change selected image" : "Choose an image from your device"}
              </span>
              <span className="text-sm text-base-content/60">
                JPG, PNG, or WEBP files work best for issue reports.
              </span>
              <span className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-content">
                Browse Files
              </span>
              <input
                type="file"
                name="issueImage"
                accept="image/*"
                className="hidden"
                onChange={onImageChange}
                required
              />
            </label>
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-base-content/70">
                {selectedFileName || "No file selected yet"}
              </p>
              {previewUrl ? (
                <div className="overflow-hidden rounded-2xl border border-base-200 bg-base-200/60">
                  <img
                    src={previewUrl}
                    alt="Issue preview"
                    className="max-h-56 w-full object-contain sm:max-h-72"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-bold">Detailed Description</span>
            </label>
            <textarea
              name="description"
              placeholder="Please provide details about the issue..."
              className="textarea textarea-bordered textarea-lg min-h-[130px] w-full rounded-2xl border-transparent bg-base-200/50 font-medium transition-all focus:textarea-primary focus:bg-base-100 sm:min-h-[150px]"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Reporting Status</span>
            </label>
            <input
              type="text"
              name="status"
              value="Ongoing"
              readOnly
              className="input input-bordered input-lg w-full rounded-2xl border-transparent bg-base-200/80 text-xs font-black uppercase tracking-widest text-primary"
            />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="label-text font-bold">Garbage Level</span>
              <span className="label-text-alt font-medium text-base-content/40">
                Determines the cleaner's reward
              </span>
            </label>
            <div className="flex flex-col gap-3">
              {([
                {
                  value: "Low" as const,
                  reward: 50,
                  emoji: "🟢",
                  desc: "Minor litter or small waste — quick to clean up.",
                  activeClass: "border-success bg-success/10",
                  badgeClass: "badge-success",
                  textClass: "text-success",
                },
                {
                  value: "Medium" as const,
                  reward: 100,
                  emoji: "🟡",
                  desc: "Moderate garbage pile needing proper disposal.",
                  activeClass: "border-warning bg-warning/10",
                  badgeClass: "badge-warning",
                  textClass: "text-warning",
                },
                {
                  value: "High" as const,
                  reward: 200,
                  emoji: "🔴",
                  desc: "Large or hazardous waste requiring urgent action.",
                  activeClass: "border-error bg-error/10",
                  badgeClass: "badge-error",
                  textClass: "text-error",
                },
              ]).map(({ value, reward, emoji, desc, activeClass, badgeClass, textClass }) => (
                <label key={value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="garbageLevel"
                    value={value}
                    checked={selectedLevel === value}
                    onChange={() => setSelectedLevel(value)}
                    className="sr-only"
                  />
                  <div
                    className={`flex flex-col items-start gap-3 rounded-2xl border-2 p-4 transition-all sm:flex-row sm:items-center sm:gap-4 ${
                      selectedLevel === value
                        ? activeClass
                        : "border-base-200 bg-base-200/40 hover:bg-base-200/70"
                    }`}
                  >
                    {/* Emoji indicator */}
                    <span className="text-2xl">{emoji}</span>

                    {/* Text info */}
                    <div className="min-w-0 flex-1">
                      <p className={`font-black ${selectedLevel === value ? textClass : "text-secondary"}`}>
                        {value}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-base-content/50">{desc}</p>
                    </div>

                    {/* Reward badge */}
                    <span className={`badge ${badgeClass} badge-lg shrink-0 self-start font-black sm:self-auto`}>
                      ৳{reward}
                    </span>

                    {/* Selected indicator */}
                    <div
                      className={`h-5 w-5 shrink-0 rounded-full border-2 transition-all ${
                        selectedLevel === value
                          ? `${textClass} border-current bg-current`
                          : "border-base-300"
                      }`}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 opacity-60 md:col-span-2 md:grid-cols-2 md:gap-8">
            <div className="form-control">
              <label className="label text-[10px] font-black uppercase tracking-widest">
                Reporting Date
              </label>
              <input
                type="text"
                name="date"
                value={new Date().toLocaleDateString()}
                readOnly
                className="input input-ghost font-bold"
              />
            </div>
            <div className="form-control">
              <label className="label text-[10px] font-black uppercase tracking-widest md:justify-end">
                Reporter Email
              </label>
              <input
                type="email"
                name="email"
                value={user?.email ?? ""}
                readOnly
                className="input input-ghost truncate px-0 text-left text-sm font-bold md:text-right"
              />
            </div>
          </div>

          <div className="pt-2 sm:pt-4 md:col-span-2 md:pt-6">
            <button
              type="submit"
              disabled={isUploading}
              className="btn btn-primary group min-h-14 w-full rounded-2xl px-4 font-black tracking-tight shadow-xl shadow-primary/20 sm:btn-lg"
            >
              {isUploading ? "Uploading image..." : "Submit Issue Report"}
              <span className="transition-transform group-hover:translate-x-1">
                {isUploading ? "..." : "→"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewIssueForm;
