import { useCallback, useEffect, useRef, useState } from "react";

import { supabase } from "../auth/supabaseClient";
import { createEmptyReadiness, mergeReadiness } from "../utils/readiness";

const DEFAULT_TARGET = 95;
const SAVE_DELAY_MS = 600;
const LEGACY_TARGET_KEY = "catly_target_percentile";

function getLegacyReadinessKeys(user) {
  return [
    `catly_readiness_${user.id}`,
    user.userId ? `catly_readiness_${user.userId}` : null,
    "catly_readiness_guest",
  ].filter(Boolean);
}

function readLegacyProfile(user) {
  let readiness = null;

  for (const key of getLegacyReadinessKeys(user)) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      if (value) {
        readiness = mergeReadiness(value);
        break;
      }
    } catch {
      // Ignore malformed legacy data and continue with a clean profile.
    }
  }

  const savedTarget = Number(localStorage.getItem(LEGACY_TARGET_KEY));
  const targetPercentile =
    Number.isFinite(savedTarget) && savedTarget >= 50 && savedTarget <= 100
      ? savedTarget
      : DEFAULT_TARGET;

  return {
    readiness: readiness || createEmptyReadiness(),
    targetPercentile,
  };
}

function clearLegacyProfile(user) {
  getLegacyReadinessKeys(user).forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem(LEGACY_TARGET_KEY);
}

export function useReadinessProfile(user) {
  const [targetPercentile, setTargetPercentile] = useState(DEFAULT_TARGET);
  const [readiness, setReadiness] = useState(createEmptyReadiness);
  const [loading, setLoading] = useState(Boolean(user?.id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const loadedUserId = useRef(null);
  const saveVersion = useRef(0);

  useEffect(() => {
    let cancelled = false;
    loadedUserId.current = null;
    saveVersion.current += 1;
    setTargetPercentile(DEFAULT_TARGET);
    setReadiness(createEmptyReadiness());
    setError("");
    setSaving(false);

    if (!user?.id) {
      setLoading(false);
      return () => { cancelled = true; };
    }

    setLoading(true);

    async function loadProfile() {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (cancelled) return;

      if (sessionError || sessionData.session?.user?.id !== user.id) {
        setError("Your session is not ready. Please sign in again.");
        setLoading(false);
        return;
      }

      const { data, error: loadError } = await supabase
        .from("user_readiness")
        .select("target_percentile, readiness_data")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (loadError) {
        const legacy = readLegacyProfile(user);
        setTargetPercentile(legacy.targetPercentile);
        setReadiness(legacy.readiness);
        setError("We could not load your readiness. Please run the latest Supabase SQL setup.");
        setLoading(false);
        return;
      }

      if (data) {
        setTargetPercentile(Number(data.target_percentile) || DEFAULT_TARGET);
        setReadiness(mergeReadiness(data.readiness_data));
        clearLegacyProfile(user);
      } else {
        const legacy = readLegacyProfile(user);
        const { error: migrationError } = await supabase.from("user_readiness").upsert({
          user_id: user.id,
          target_percentile: legacy.targetPercentile,
          readiness_data: legacy.readiness,
          updated_at: new Date().toISOString(),
        });

        if (cancelled) return;

        setTargetPercentile(legacy.targetPercentile);
        setReadiness(legacy.readiness);

        if (migrationError) {
          setError("We could not save your readiness. Please run the latest Supabase SQL setup.");
        } else {
          clearLegacyProfile(user);
        }
      }

      loadedUserId.current = user.id;
      setLoading(false);
    }

    loadProfile();
    return () => { cancelled = true; };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || loadedUserId.current !== user.id) return undefined;

    const version = ++saveVersion.current;
    setSaving(true);
    const timeoutId = window.setTimeout(async () => {
      const { error: saveError } = await supabase.from("user_readiness").upsert({
        user_id: user.id,
        target_percentile: targetPercentile,
        readiness_data: readiness,
        updated_at: new Date().toISOString(),
      });

      if (version !== saveVersion.current) return;
      setSaving(false);
      setError(saveError ? "We could not save your latest readiness changes." : "");
    }, SAVE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [readiness, targetPercentile, user?.id]);

  const resetReadiness = useCallback(() => {
    setReadiness(createEmptyReadiness());
  }, []);

  return {
    targetPercentile,
    setTargetPercentile,
    readiness,
    setReadiness,
    resetReadiness,
    loading,
    saving,
    error,
  };
}
