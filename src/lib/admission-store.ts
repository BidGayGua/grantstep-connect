import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useSyncExternalStore } from "react";

export type ApplicationStatus =
  | "not_started"
  | "specialty_selected"
  | "documents_in_progress"
  | "documents_ready"
  | "application_submitted"
  | "under_review"
  | "approved";

export type AdmissionStep =
  | "select_specialty"
  | "prepare_documents"
  | "submit_application"
  | "track_status"
  | "get_result";

export type AdmissionState = {
  selectedSpecialty: string | null;
  applicationStatus: ApplicationStatus;
  currentStep: AdmissionStep;
};

const STORAGE_KEY = "grantstep.admission-state";

const initialState: AdmissionState = {
  selectedSpecialty: null,
  applicationStatus: "not_started",
  currentStep: "select_specialty",
};

let state: AdmissionState = initialState;
let hydrated = false;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

async function persist() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Demo storage should never break the UI.
  }
}

async function hydrate() {
  if (hydrated) return;
  hydrated = true;

  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<AdmissionState>;
    state = {
      selectedSpecialty: parsed.selectedSpecialty ?? initialState.selectedSpecialty,
      applicationStatus: parsed.applicationStatus ?? initialState.applicationStatus,
      currentStep: parsed.currentStep ?? initialState.currentStep,
    };
    emit();
  } catch {
    state = initialState;
  }
}

function update(updater: (current: AdmissionState) => AdmissionState) {
  state = updater(state);
  emit();
  void persist();
}

export const admissionStore = {
  get: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    void hydrate();
    return () => listeners.delete(listener);
  },
  setSelectedSpecialty: (specialty: string | null) => {
    update((current) => ({
      ...current,
      selectedSpecialty: specialty,
      applicationStatus: specialty ? "specialty_selected" : "not_started",
      currentStep: specialty ? "prepare_documents" : "select_specialty",
    }));
  },
  submitApplication: () => {
    update((current) => ({
      ...current,
      applicationStatus: "application_submitted",
      currentStep: "track_status",
    }));

    // Simulate review process for demo
    setTimeout(() => {
      admissionStore.setApplicationStatus("under_review");
      setTimeout(() => {
        admissionStore.setApplicationStatus("approved");
      }, 6000);
    }, 4000);
  },
  setApplicationStatus: (status: ApplicationStatus) => {
    update((current) => {
      let nextStep = current.currentStep;
      if (status === "approved") nextStep = "get_result";
      else if (status === "application_submitted" || status === "under_review") nextStep = "track_status";
      else if (status === "documents_ready") nextStep = "submit_application";
      else if (status === "documents_in_progress" || status === "specialty_selected") nextStep = "prepare_documents";
      else if (status === "not_started") nextStep = "select_specialty";

      return {
        ...current,
        applicationStatus: status,
        currentStep: nextStep,
      };
    });
  },
};

export function useAdmission() {
  useEffect(() => {
    void hydrate();
  }, []);

  return useSyncExternalStore(
    admissionStore.subscribe,
    admissionStore.get,
    admissionStore.get,
  );
}

export function admissionProgress(admission: AdmissionState) {
  const status = admission.applicationStatus;

  if (status === "approved") return 100;
  if (status === "application_submitted" || status === "under_review") return 80;
  if (status === "documents_ready") return 60;
  if (status === "documents_in_progress") return 40;
  if (status === "specialty_selected" || admission.selectedSpecialty) return 20;
  return 0;
}
