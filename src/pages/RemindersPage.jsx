import { useEffect, useMemo, useState } from "react";
import { CAT_EXAM_DATE } from "../data/catData";
import { supabase } from "../auth/supabaseClient";

const REMINDER_COLORS = ["purple", "cyan", "green", "amber"];

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
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [color, setColor] = useState("purple");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadReminders() {
      if (!user?.id) {
        if (!cancelled) {
          setReminders([]);
          setPageError("Please sign in to view your reminders.");
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      setPageError("");
      const { data, error } = await supabase
        .from("reminders")
        .select("id, title, description, reminder_date, color, created_at")
        .order("reminder_date", { ascending: true, nullsFirst: false });
      if (cancelled) return;
      if (error) {
        setPageError("We could not load your reminders. Please try again.");
        setReminders([]);
      } else {
        setReminders(data.map(toReminder));
      }
      setLoading(false);
    }
    loadReminders();
    return () => { cancelled = true; };
  }, [user?.id]);

  const sortedReminders = useMemo(() => [...reminders].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  }), [reminders]);

  function resetForm() {
    setTitle(""); setDescription(""); setDate(""); setColor("purple");
    setFormError(""); setEditingId(null);
  }
  function openAddForm() { resetForm(); setShowForm(true); }
  function openEditForm(reminder) {
    setEditingId(reminder.id); setTitle(reminder.title);
    setDescription(reminder.description || ""); setDate(reminder.date || "");
    setColor(reminder.color || "purple"); setFormError(""); setShowForm(true);
  }
  function closeForm() {
    if (saving) return;
    setShowForm(false); resetForm();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim() || saving) return;
    if (date && date < getToday()) {
      setFormError("Choose today or a future date for this reminder.");
      return;
    }
    if (!user?.id) {
      setFormError("Please sign in again before saving a reminder.");
      return;
    }
    setSaving(true); setFormError("");
    const values = { title: title.trim(), description: description.trim(), reminder_date: date || null, color };
    const request = editingId
      ? supabase.from("reminders").update(values).eq("id", editingId)
          .select("id, title, description, reminder_date, color, created_at").single()
      : supabase.from("reminders").insert({ ...values, user_id: user.id })
          .select("id, title, description, reminder_date, color, created_at").single();
    const { data, error } = await request;
    setSaving(false);
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
    setPageError("");
    setReminders((current) => current.filter((reminder) => reminder.id !== id));
    const { error } = await supabase.from("reminders").delete().eq("id", id);
    if (error) {
      setReminders(previousReminders);
      setPageError("We could not delete this reminder. Please try again.");
    }
  }

  return (
    <div className="narrow reminders-page">
      <div className="reminders-header">
        <div><div className="section-title xl">Reminders</div><div className="muted">Your important moments on the CAT journey.</div></div>
        <button className="add-reminder-btn" onClick={openAddForm} disabled={loading}>+ Add Reminder</button>
      </div>
      {pageError && <p className="form-error" role="alert">{pageError}</p>}
      <div className="reminders section-gap">
        <div className="card reminder purple fixed-reminder"><div><b>CAT Exam</b><div className="muted">Your final destination.</div></div><div className="reminder-date-group"><span>{formatExamDate()}</span><small>FIXED</small></div></div>
        {sortedReminders.map((reminder) => (
          <div className={`card reminder ${reminder.color || "purple"}`} key={reminder.id}>
            <div className="reminder-main"><b>{reminder.title}</b>{reminder.description && <div className="muted">{reminder.description}</div>}</div>
            <div className="reminder-right"><span>{formatDate(reminder.date)}</span><div className="reminder-actions"><button onClick={() => openEditForm(reminder)}>Edit</button><button className="delete-reminder" onClick={() => deleteReminder(reminder.id)}>Delete</button></div></div>
          </div>
        ))}
        {loading && <div className="reminders-empty"><b>Loading your reminders…</b></div>}
        {!loading && sortedReminders.length === 0 && !pageError && <div className="reminders-empty"><b>No personal reminders yet.</b><div className="muted">Add important dates, mocks, revision goals or application deadlines.</div></div>}
      </div>
      {showForm && (
        <div className="reminder-modal-backdrop" onClick={closeForm}>
          <div className="reminder-modal" onClick={(event) => event.stopPropagation()}>
            <div className="reminder-modal-head"><div><div className="section-title">{editingId ? "Edit Reminder" : "Add Reminder"}</div><div className="muted">Add something important to your CAT journey.</div></div><button className="modal-close" onClick={closeForm} disabled={saving}>×</button></div>
            <form onSubmit={handleSubmit}>
              <label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Finish Arithmetic" required /></label>
              <label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What do you want to remember?" rows="3" /></label>
              <label>Date<input type="date" value={date} min={getToday()} onChange={(event) => { setDate(event.target.value); setFormError(""); }} /></label>
              {formError && <p className="form-error" role="alert">{formError}</p>}
              <label>Card colour<select value={color} onChange={(event) => setColor(event.target.value)}>{REMINDER_COLORS.map((reminderColor) => <option value={reminderColor} key={reminderColor}>{reminderColor.charAt(0).toUpperCase() + reminderColor.slice(1)}</option>)}</select></label>
              <div className="reminder-form-actions"><button type="button" className="form-cancel" onClick={closeForm} disabled={saving}>Cancel</button><button type="submit" className="form-save" disabled={saving}>{saving ? "Saving…" : editingId ? "Save Changes" : "Add Reminder"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
