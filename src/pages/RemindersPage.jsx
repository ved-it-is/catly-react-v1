import { useEffect, useMemo, useState } from "react";
import { CAT_EXAM_DATE } from "../data/catData";
import { supabase } from "../auth/supabaseClient";

const REMINDER_COLORS = ["purple", "cyan", "green", "amber"];
const SCHEDULE_OPTIONS = [
  { title: "Quant practice", detail: "Solve a focused QA question set" },
  { title: "VARC reading", detail: "Read and analyse one RC passage" },
  { title: "DILR set", detail: "Complete one timed DILR set" },
  { title: "Mock test", detail: "Take a full-length CAT mock" },
  { title: "Mock analysis", detail: "Review mistakes and learnings" },
  { title: "Revision", detail: "Revise formulas, concepts or notes" },
];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function toReminder(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    date: row.reminder_date || "",
    color: row.color || "purple",
  };
}

function toScheduleTask(row) {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    createdAt: row.created_at,
  };
}

function formatDate(date) {
  if (!date) return "No date";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatExamDate() {
  return new Date(CAT_EXAM_DATE).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function RemindersPage({ user }) {
  const [reminders, setReminders] = useState([]);
  const [scheduleTasks, setScheduleTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminderError, setReminderError] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [color, setColor] = useState("purple");
  const [formError, setFormError] = useState("");
  const [savingReminder, setSavingReminder] = useState(false);
  const [customTask, setCustomTask] = useState("");
  const [savingTask, setSavingTask] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPlanner() {
      if (!user?.id) {
        if (!cancelled) {
          setReminderError("Please sign in to view your planner.");
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setReminderError("");
      setScheduleError("");

      const [reminderResult, scheduleResult] = await Promise.all([
        supabase
          .from("reminders")
          .select("id, title, description, reminder_date, color")
          .order("reminder_date", { ascending: true, nullsFirst: false }),
        supabase
          .from("schedule_tasks")
          .select("id, title, status, created_at")
          .order("created_at", { ascending: true }),
      ]);

      if (cancelled) return;

      if (reminderResult.error) {
        setReminderError("We could not load your reminders. Please try again.");
      } else {
        setReminders(reminderResult.data.map(toReminder));
      }

      if (scheduleResult.error) {
        setScheduleError("We could not load your schedule. Please run the new Supabase SQL setup, then refresh.");
      } else {
        setScheduleTasks(scheduleResult.data.map(toScheduleTask));
      }

      setLoading(false);
    }

    loadPlanner();
    return () => { cancelled = true; };
  }, [user?.id]);

  const sortedReminders = useMemo(() => [...reminders].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  }), [reminders]);

  function resetReminderForm() {
    setTitle("");
    setDescription("");
    setDate("");
    setColor("purple");
    setFormError("");
    setEditingId(null);
  }

  function openAddForm() {
    resetReminderForm();
    setShowForm(true);
  }

  function openEditForm(reminder) {
    setEditingId(reminder.id);
    setTitle(reminder.title);
    setDescription(reminder.description || "");
    setDate(reminder.date || "");
    setColor(reminder.color || "purple");
    setFormError("");
    setShowForm(true);
  }

  function closeForm() {
    if (savingReminder) return;
    setShowForm(false);
    resetReminderForm();
  }

  async function handleReminderSubmit(event) {
    event.preventDefault();
    if (!title.trim() || savingReminder) return;

    if (date && date < getToday()) {
      setFormError("Choose today or a future date for this reminder.");
      return;
    }

    setSavingReminder(true);
    setFormError("");
    const values = {
      title: title.trim(),
      description: description.trim(),
      reminder_date: date || null,
      color,
    };
    const request = editingId
      ? supabase.from("reminders").update(values).eq("id", editingId)
          .select("id, title, description, reminder_date, color").single()
      : supabase.from("reminders").insert({ ...values, user_id: user.id })
          .select("id, title, description, reminder_date, color").single();
    const { data, error } = await request;
    setSavingReminder(false);

    if (error) {
      setFormError("We could not save this reminder. Please try again.");
      return;
    }

    const savedReminder = toReminder(data);
    setReminders((current) => editingId
      ? current.map((reminder) => reminder.id === editingId ? savedReminder : reminder)
      : [...current, savedReminder]);
    closeForm();
  }

  async function deleteReminder(id) {
    if (!window.confirm("Delete this reminder?")) return;
    const previousReminders = reminders;
    setReminders((current) => current.filter((reminder) => reminder.id !== id));
    const { error } = await supabase.from("reminders").delete().eq("id", id);
    if (error) {
      setReminders(previousReminders);
      setReminderError("We could not delete this reminder. Please try again.");
    }
  }

  async function addScheduleTask(taskTitle) {
    const trimmedTitle = taskTitle.trim();
    if (!trimmedTitle || savingTask || !user?.id) return;

    setSavingTask(true);
    setScheduleError("");
    const { data, error } = await supabase
      .from("schedule_tasks")
      .insert({ user_id: user.id, title: trimmedTitle, status: "pending" })
      .select("id, title, status, created_at")
      .single();
    setSavingTask(false);

    if (error) {
      setScheduleError("We could not add this task. Please run the new Supabase SQL setup, then try again.");
      return;
    }

    setScheduleTasks((current) => [...current, toScheduleTask(data)]);
    setCustomTask("");
  }

  async function toggleTaskStatus(task) {
    if (updatingTaskId || deletingTaskId) return;
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    setUpdatingTaskId(task.id);
    setScheduleError("");

    const { data, error } = await supabase
      .from("schedule_tasks")
      .update({
        status: nextStatus,
        completed_at: nextStatus === "completed" ? new Date().toISOString() : null,
      })
      .eq("id", task.id)
      .select("id, title, status, created_at")
      .single();
    setUpdatingTaskId(null);

    if (error) {
      setScheduleError("We could not update this task. Please try again.");
      return;
    }

    const savedTask = toScheduleTask(data);
    setScheduleTasks((current) => current.map((item) => item.id === task.id ? savedTask : item));
  }

  async function deleteScheduleTask(task) {
    if (deletingTaskId || !window.confirm(`Delete “${task.title}” from your schedule?`)) return;

    setDeletingTaskId(task.id);
    setScheduleError("");
    const { error } = await supabase.from("schedule_tasks").delete().eq("id", task.id);
    setDeletingTaskId(null);

    if (error) {
      setScheduleError("We could not delete this task. Please run the new Supabase SQL setup, then try again.");
      return;
    }

    setScheduleTasks((current) => current.filter((item) => item.id !== task.id));
  }

  function handleCustomTaskSubmit(event) {
    event.preventDefault();
    addScheduleTask(customTask);
  }

  return (
    <div className="narrow reminders-page">
      <div className="reminders-header">
        <div>
          <div className="section-title xl">Planner</div>
          <div className="muted">Keep important reminders and your study schedule in one place.</div>
        </div>
        <button className="add-reminder-btn" onClick={openAddForm} disabled={loading}>+ Add Reminder</button>
      </div>

      <section className="planner-section">
        <div className="planner-section-heading">
          <div>
            <h2>Today’s Schedule</h2>
            <p>Choose study cards or add your own task. Tasks stay saved until you change their status.</p>
          </div>
          <span className="schedule-count">{scheduleTasks.filter((task) => task.status === "completed").length}/{scheduleTasks.length} completed</span>
        </div>

        {scheduleError && <p className="form-error" role="alert">{scheduleError}</p>}

        <div className="schedule-options">
          {SCHEDULE_OPTIONS.map((option) => {
            const alreadyAdded = scheduleTasks.some((task) => task.title.toLowerCase() === option.title.toLowerCase());
            return (
              <button
                type="button"
                className="schedule-option"
                key={option.title}
                onClick={() => addScheduleTask(option.title)}
                disabled={loading || savingTask || alreadyAdded}
              >
                <b>{option.title}</b>
                <span>{alreadyAdded ? "Added to schedule" : option.detail}</span>
              </button>
            );
          })}
        </div>

        <form className="custom-task-form" onSubmit={handleCustomTaskSubmit}>
          <input
            value={customTask}
            onChange={(event) => setCustomTask(event.target.value)}
            placeholder="Add your own study task"
            maxLength="140"
            aria-label="Custom schedule task"
          />
          <button type="submit" disabled={savingTask || !customTask.trim()}>
            {savingTask ? "Adding…" : "Add task"}
          </button>
        </form>

        <div className="schedule-task-list">
          {loading && <div className="reminders-empty"><b>Loading your schedule…</b></div>}
          {!loading && scheduleTasks.length === 0 && !scheduleError && (
            <div className="reminders-empty"><b>Your schedule is empty.</b><div className="muted">Choose a study card above to build your daily plan.</div></div>
          )}
          {scheduleTasks.map((task) => (
            <article className={`schedule-task ${task.status === "completed" ? "is-completed" : ""}`} key={task.id}>
              <div>
                <span className="schedule-status">{task.status === "completed" ? "Completed" : "Pending"}</span>
                <b>{task.title}</b>
              </div>
              <div className="schedule-task-actions">
                <button
                  type="button"
                  className="task-status-button"
                  onClick={() => toggleTaskStatus(task)}
                  disabled={updatingTaskId === task.id || deletingTaskId === task.id}
                >
                  {updatingTaskId === task.id ? "Saving…" : task.status === "completed" ? "Mark pending" : "Mark completed"}
                </button>
                <button
                  type="button"
                  className="task-delete-button"
                  onClick={() => deleteScheduleTask(task)}
                  disabled={deletingTaskId === task.id || updatingTaskId === task.id}
                >
                  {deletingTaskId === task.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="planner-section planner-reminders">
        <div className="planner-section-heading">
          <div><h2>Reminders</h2><p>Important dates and events for your CAT journey.</p></div>
        </div>
        {reminderError && <p className="form-error" role="alert">{reminderError}</p>}
        <div className="reminders">
          <div className="card reminder purple fixed-reminder">
            <div><b>CAT Exam</b><div className="muted">Your final destination.</div></div>
            <div className="reminder-date-group"><span>{formatExamDate()}</span><small>FIXED</small></div>
          </div>
          {sortedReminders.map((reminder) => (
            <div className={`card reminder ${reminder.color || "purple"}`} key={reminder.id}>
              <div className="reminder-main"><b>{reminder.title}</b>{reminder.description && <div className="muted">{reminder.description}</div>}</div>
              <div className="reminder-right"><span>{formatDate(reminder.date)}</span><div className="reminder-actions"><button onClick={() => openEditForm(reminder)}>Edit</button><button className="delete-reminder" onClick={() => deleteReminder(reminder.id)}>Delete</button></div></div>
            </div>
          ))}
          {loading && <div className="reminders-empty"><b>Loading your reminders…</b></div>}
          {!loading && sortedReminders.length === 0 && !reminderError && <div className="reminders-empty"><b>No personal reminders yet.</b><div className="muted">Add important dates, mocks, revision goals or application deadlines.</div></div>}
        </div>
      </section>

      {showForm && (
        <div className="reminder-modal-backdrop" onClick={closeForm}>
          <div className="reminder-modal" onClick={(event) => event.stopPropagation()}>
            <div className="reminder-modal-head"><div><div className="section-title">{editingId ? "Edit Reminder" : "Add Reminder"}</div><div className="muted">Add something important to your CAT journey.</div></div><button className="modal-close" onClick={closeForm} disabled={savingReminder}>×</button></div>
            <form onSubmit={handleReminderSubmit}>
              <label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Finish Arithmetic" required /></label>
              <label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What do you want to remember?" rows="3" /></label>
              <label>Date<input type="date" value={date} min={getToday()} onChange={(event) => { setDate(event.target.value); setFormError(""); }} /></label>
              {formError && <p className="form-error" role="alert">{formError}</p>}
              <label>Card colour<select value={color} onChange={(event) => setColor(event.target.value)}>{REMINDER_COLORS.map((reminderColor) => <option value={reminderColor} key={reminderColor}>{reminderColor.charAt(0).toUpperCase() + reminderColor.slice(1)}</option>)}</select></label>
              <div className="reminder-form-actions"><button type="button" className="form-cancel" onClick={closeForm} disabled={savingReminder}>Cancel</button><button type="submit" className="form-save" disabled={savingReminder}>{savingReminder ? "Saving…" : editingId ? "Save Changes" : "Add Reminder"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
