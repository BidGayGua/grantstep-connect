import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useSyncExternalStore } from "react";

export type DocStatus = "missing" | "uploaded" | "review" | "approved";

export type DocId = "id" | "att" | "photo" | "med" | "ent";

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

export type DocumentsState = Record<DocId, DocStatus>;

export type AdmissionState = {
  selectedSpecialty: string | null;
  documents: DocumentsState;
  applicationStatus: ApplicationStatus;
  currentStep: AdmissionStep;
};

const STORAGE_KEY = "grantstep.admission-state";

export const DOC_IDS: DocId[] = ["id", "att", "photo", "med", "ent"];

const initialDocuments: DocumentsState = {
  id: "missing",
  att: "missing",
  photo: "missing",
  med: "missing",
  ent: "missing",
};

const initialState: AdmissionState = {
  selectedSpecialty: "Программная инженерия",
  documents: initialDocuments,
  applicationStatus: "specialty_selected",
  currentStep: "prepare_documents",
};

let state: AdmissionState = initialState;
let hydrated = false;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export function docProgress(docs: DocumentsState) {
  const done = DOC_IDS.filter((id) => docs[id] !== "missing").length;
  return {
    done,
    total: DOC_IDS.length,
    percent: Math.round((done / DOC_IDS.length) * 100),
  };
}

export function deriveApplicationStatus(nextState: AdmissionState): ApplicationStatus {
  const { done, total } = docProgress(nextState.documents);
  const hasSpecialty = Boolean(nextState.selectedSpecialty);

  if (nextState.applicationStatus === "approved") return "approved";
  if (nextState.applicationStatus === "under_review") return "under_review";
  if (nextState.applicationStatus === "application_submitted") return "application_submitted";
  if (hasSpecialty && done === total) return "documents_ready";
  if (hasSpecialty && done > 0) return "documents_in_progress";
  if (hasSpecialty) return "specialty_selected";
  return "not_started";
}

export function deriveCurrentStep(nextState: AdmissionState): AdmissionStep {
  const status = deriveApplicationStatus(nextState);
  if (status === "approved") return "get_result";
  if (status === "application_submitted" || status === "under_review") return "track_status";
  if (status === "documents_ready") return "submit_application";
  if (status === "documents_in_progress" || status === "specialty_selected") {
    return "prepare_documents";
  }
  return "select_specialty";
}

function normalize(nextState: AdmissionState): AdmissionState {
  const status = deriveApplicationStatus(nextState);
  return {
    ...nextState,
    applicationStatus: status,
    currentStep: deriveCurrentStep({ ...nextState, applicationStatus: status }),
  };
}

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
    state = normalize({
      selectedSpecialty: parsed.selectedSpecialty ?? initialState.selectedSpecialty,
      documents: { ...initialDocuments, ...parsed.documents },
      applicationStatus: parsed.applicationStatus ?? initialState.applicationStatus,
      currentStep: parsed.currentStep ?? initialState.currentStep,
    });
    emit();
  } catch {
    state = initialState;
  }
}

function update(updater: (current: AdmissionState) => AdmissionState) {
  state = normalize(updater(state));
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
    }));
  },
  setDocument: (id: DocId, status: DocStatus) => {
    update((current) => ({
      ...current,
      documents: { ...current.documents, [id]: status },
      applicationStatus:
        current.applicationStatus === "application_submitted" ||
        current.applicationStatus === "under_review" ||
        current.applicationStatus === "approved"
          ? "documents_in_progress"
          : current.applicationStatus,
    }));
  },
  submitApplication: () => {
    update((current) => ({
      ...current,
      applicationStatus: "application_submitted",
      currentStep: "track_status",
    }));
  },
  setApplicationStatus: (status: ApplicationStatus) => {
    update((current) => ({
      ...current,
      applicationStatus: status,
    }));
  },
};

export const documentsStore = {
  get: () => state.documents,
  set: (id: DocId, status: DocStatus) => admissionStore.setDocument(id, status),
  subscribe: admissionStore.subscribe,
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

export function useDocuments() {
  const admission = useAdmission();
  return admission.documents;
}

export function admissionProgress(admission: AdmissionState) {
  const docs = docProgress(admission.documents);
  const status = admission.applicationStatus;

  if (status === "approved") return 100;
  if (status === "application_submitted" || status === "under_review") return 80;
  if (docs.done === docs.total) return 60;
  if (docs.done > 0) return 40;
  if (admission.selectedSpecialty) return 20;
  return 0;
}

export const STATUS_LABEL: Record<DocStatus, string> = {
  missing: "Нужно загрузить",
  uploaded: "Загружено",
  review: "На проверке",
  approved: "Одобрено",
};
