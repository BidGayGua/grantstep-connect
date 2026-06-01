import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useSyncExternalStore } from "react";

export type ExpenseFieldId =
  | "dorm"
  | "food"
  | "transport"
  | "materials"
  | "internet"
  | "personal";
export type ExpensePresetId = "economy" | "medium" | "comfort";

export type ExpenseState = {
  activePreset: ExpensePresetId;
  values: Record<ExpenseFieldId, string>;
};

const STORAGE_KEY = "grantstep.expense-state";

export const expensePresets: Record<ExpensePresetId, Record<ExpenseFieldId, string>> = {
  economy: {
    dorm: "15000",
    food: "45000",
    transport: "8000",
    materials: "7000",
    internet: "5000",
    personal: "10000",
  },
  medium: {
    dorm: "25000",
    food: "65000",
    transport: "12000",
    materials: "12000",
    internet: "7000",
    personal: "20000",
  },
  comfort: {
    dorm: "45000",
    food: "90000",
    transport: "20000",
    materials: "20000",
    internet: "10000",
    personal: "35000",
  },
};

const initialState: ExpenseState = {
  activePreset: "medium",
  values: expensePresets.medium,
};

let state = initialState;
let hydrated = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export function expenseTotal(values: Record<ExpenseFieldId, string>) {
  return Object.values(values).reduce((sum, raw) => {
    const value = Number(raw.replace(/\s/g, ""));
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);
}

async function persist() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Local demo storage must not block the calculator UI.
  }
}

async function hydrate() {
  if (hydrated) return;
  hydrated = true;

  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<ExpenseState>;
    state = {
      activePreset: parsed.activePreset ?? initialState.activePreset,
      values: { ...initialState.values, ...parsed.values },
    };
    emit();
  } catch {
    state = initialState;
  }
}

function update(nextState: ExpenseState) {
  state = nextState;
  emit();
  void persist();
}

export const expenseStore = {
  get: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    void hydrate();
    return () => listeners.delete(listener);
  },
  setField: (id: ExpenseFieldId, value: string) => {
    update({
      activePreset: "medium",
      values: {
        ...state.values,
        [id]: value.replace(/[^\d]/g, ""),
      },
    });
  },
  applyPreset: (preset: ExpensePresetId) => {
    update({
      activePreset: preset,
      values: expensePresets[preset],
    });
  },
};

export function useExpenses() {
  useEffect(() => {
    void hydrate();
  }, []);

  return useSyncExternalStore(expenseStore.subscribe, expenseStore.get, expenseStore.get);
}
