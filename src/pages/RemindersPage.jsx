import { useEffect, useMemo, useState } from "react";
import { CAT_EXAM_DATE } from "../data/catData";

const REMINDER_COLORS = [
  "purple",
  "cyan",
  "green",
  "amber",
];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getReminderKey(user) {
  const userId = user?.userId || "guest";

  return `catly_reminders_${userId}`;
}

function loadReminders(user) {
  try {
    return JSON.parse(
      localStorage.getItem(getReminderKey(user)) || "[]"
    );
  } catch {
    return [];
  }
}

function formatDate(date) {
  if (!date) return "No date";

  const parsed = new Date(`${date}T00:00:00`);

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function formatExamDate() {
  return new Date(CAT_EXAM_DATE).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

export default function RemindersPage({ user }) {

  const [reminders, setReminders] =
    useState(() => loadReminders(user));

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [date, setDate] =
    useState("");

  const [color, setColor] =
    useState("purple");

  const [formError, setFormError] =
    useState("");


  useEffect(() => {

    localStorage.setItem(
      getReminderKey(user),
      JSON.stringify(reminders)
    );

  }, [reminders, user]);


  const sortedReminders = useMemo(() => {

    return [...reminders].sort((a, b) => {

      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;

      return new Date(a.date) - new Date(b.date);

    });

  }, [reminders]);


  function resetForm() {

    setTitle("");
    setDescription("");
    setDate("");
    setColor("purple");
    setFormError("");

    setEditingId(null);

  }


  function openAddForm() {

    resetForm();

    setShowForm(true);

  }


  function openEditForm(reminder) {

    setEditingId(reminder.id);

    setTitle(reminder.title);
    setDescription(reminder.description || "");
    setDate(reminder.date || "");
    setColor(reminder.color || "purple");

    setShowForm(true);

  }


  function closeForm() {

    setShowForm(false);

    resetForm();

  }


  function handleSubmit(event) {

    event.preventDefault();

    if (!title.trim()) return;

    if (date && date < getToday()) {
      setFormError("Choose today or a future date for this reminder.");
      return;
    }


    if (editingId) {

      setReminders((current) =>
        current.map((reminder) =>
          reminder.id === editingId
            ? {
                ...reminder,
                title: title.trim(),
                description: description.trim(),
                date,
                color,
              }
            : reminder
        )
      );

    } else {

      const newReminder = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        date,
        color,
        createdAt: new Date().toISOString(),
      };

      setReminders((current) => [
        ...current,
        newReminder,
      ]);

    }


    closeForm();

  }


  function deleteReminder(id) {

    const confirmed = window.confirm(
      "Delete this reminder?"
    );

    if (!confirmed) return;


    setReminders((current) =>
      current.filter(
        (reminder) =>
          reminder.id !== id
      )
    );

  }


  return (

    <div className="narrow reminders-page">

      <div className="reminders-header">

        <div>

          <div className="section-title xl">
            Reminders
          </div>

          <div className="muted">
            Your important moments on the CAT journey.
          </div>

        </div>


        <button
          className="add-reminder-btn"
          onClick={openAddForm}
        >
          + Add Reminder
        </button>

      </div>


      <div className="reminders section-gap">


        {/* FIXED CAT EXAM CARD */}

        <div className="card reminder purple fixed-reminder">

          <div>

            <b>CAT Exam</b>

            <div className="muted">
              Your final destination.
            </div>

          </div>


          <div className="reminder-date-group">

            <span>
              {formatExamDate()}
            </span>

            <small>
              FIXED
            </small>

          </div>

        </div>


        {/* USER REMINDERS */}

        {sortedReminders.map(
          (reminder) => (

            <div
              className={`card reminder ${reminder.color || "purple"}`}
              key={reminder.id}
            >

              <div className="reminder-main">

                <b>
                  {reminder.title}
                </b>

                {reminder.description && (

                  <div className="muted">
                    {reminder.description}
                  </div>

                )}

              </div>


              <div className="reminder-right">

                <span>
                  {formatDate(reminder.date)}
                </span>


                <div className="reminder-actions">

                  <button
                    onClick={() =>
                      openEditForm(reminder)
                    }
                  >
                    Edit
                  </button>


                  <button
                    className="delete-reminder"
                    onClick={() =>
                      deleteReminder(reminder.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          )
        )}


        {sortedReminders.length === 0 && (

          <div className="reminders-empty">

            <b>No personal reminders yet.</b>

            <div className="muted">
              Add important dates, mocks, revision goals or application deadlines.
            </div>

          </div>

        )}

      </div>


      {/* ADD / EDIT MODAL */}

      {showForm && (

        <div
          className="reminder-modal-backdrop"
          onClick={closeForm}
        >

          <div
            className="reminder-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="reminder-modal-head">

              <div>

                <div className="section-title">

                  {editingId
                    ? "Edit Reminder"
                    : "Add Reminder"
                  }

                </div>

                <div className="muted">

                  Add something important to your CAT journey.

                </div>

              </div>


              <button
                className="modal-close"
                onClick={closeForm}
              >
                ×
              </button>

            </div>


            <form onSubmit={handleSubmit}>


              <label>

                Title

                <input
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="e.g. Finish Arithmetic"
                  required
                />

              </label>


              <label>

                Description

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="What do you want to remember?"
                  rows="3"
                />

              </label>


              <label>

                Date

                <input
                  type="date"
                  value={date}
                  min={getToday()}
                  onChange={(event) =>
                    { setDate(event.target.value); setFormError(""); }
                  }
                />

              </label>

              {formError && (
                <p className="form-error" role="alert">{formError}</p>
              )}


              <label>

                Card colour

                <select
                  value={color}
                  onChange={(event) =>
                    setColor(event.target.value)
                  }
                >

                  <option value="purple">
                    Purple
                  </option>

                  <option value="cyan">
                    Cyan
                  </option>

                  <option value="green">
                    Green
                  </option>

                  <option value="amber">
                    Amber
                  </option>

                </select>

              </label>


              <div className="reminder-form-actions">

                <button
                  type="button"
                  className="form-cancel"
                  onClick={closeForm}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="form-save"
                >
                  {editingId
                    ? "Save Changes"
                    : "Add Reminder"
                  }
                </button>

              </div>


            </form>

          </div>

        </div>

      )}

    </div>

  );

}
