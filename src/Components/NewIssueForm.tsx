import type { FormEventHandler } from "react";
import type { User } from "firebase/auth";

interface NewIssueFormProps {
  handleSubmit: FormEventHandler<HTMLFormElement>;
  user: User | null;
}

const NewIssueForm = ({ handleSubmit, user }: NewIssueFormProps) => {
  return (
    <div className="card mx-auto max-w-4xl overflow-hidden rounded-[3rem] border border-base-200 bg-base-100 shadow-sm">
      <div className="card-body p-8 md:p-12">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 text-secondary md:grid-cols-2">
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
              <span className="label-text font-bold">Image URL</span>
            </label>
            <input
              type="text"
              name="image"
              placeholder="https://images.unsplash.com/..."
              className="input input-bordered input-lg w-full rounded-2xl border-transparent bg-base-200/50 font-medium transition-all focus:input-primary focus:bg-base-100"
              required
            />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-bold">Detailed Description</span>
            </label>
            <textarea
              name="description"
              placeholder="Please provide details about the issue..."
              className="textarea textarea-bordered textarea-lg min-h-[150px] w-full rounded-2xl border-transparent bg-base-200/50 font-medium transition-all focus:textarea-primary focus:bg-base-100"
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

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Estimated Work Multiplier</span>
            </label>
            <input
              type="number"
              name="amount"
              defaultValue={500}
              className="input input-bordered input-lg w-full rounded-2xl border-transparent bg-base-200/50 font-medium transition-all focus:input-primary focus:bg-base-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-8 opacity-60 md:col-span-2 md:grid-cols-2">
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
            <div className="form-control text-right">
              <label className="label justify-end text-[10px] font-black uppercase tracking-widest">
                Reporter Email
              </label>
              <input
                type="email"
                name="email"
                value={user?.email ?? ""}
                readOnly
                className="input input-ghost text-right font-bold"
              />
            </div>
          </div>

          <div className="pt-6 md:col-span-2">
            <button
              type="submit"
              className="btn btn-primary btn-lg group w-full rounded-2xl font-black tracking-tight shadow-xl shadow-primary/20"
            >
              Submit Issue Report
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewIssueForm;
