import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FieldName } from '../../types/fieldOptions';
import { FilterValueType } from '../../types/filterValueType';

const defaultFilterValue: FilterValueType = { text: null, min: null, max: null};

interface ControlPanelContextType {
  sortAscending: boolean;
  selectedField: FieldName | null;
  filterValue: FilterValueType;
  toggleSort: () => void;
  handleSelectedFieldChange: (field: string) => void;
  setFilterValue: (value: FilterValueType) => void;
  updateFilterValue: (key: string, value: string | number) => void;
  resetControlPanel: () => void;
}

const defaultContextValue: ControlPanelContextType = {
  sortAscending: false,
  selectedField: null,
  filterValue: defaultFilterValue,
  toggleSort: () => {},
  handleSelectedFieldChange: () => {},
  setFilterValue: () => {},
  updateFilterValue: () => {},
  resetControlPanel: () => {}
};

const ControlPanelContext = createContext<ControlPanelContextType>(defaultContextValue);

export const useControlPanel = () => useContext(ControlPanelContext);

interface ControlPanelProviderProps {
  children: ReactNode;
}

export const ControlPanelProvider: React.FC<ControlPanelProviderProps> = ({ children }) => {
  const [sortAscending, setSortAscending] = useState<boolean>(false);
  const [selectedField, setSelectedField] = useState<FieldName | null>(null);
  const [filterValue, setFilterValue] = useState<FilterValueType>(defaultFilterValue);

  const toggleSort = () => setSortAscending(!sortAscending);
  const handleSelectedFieldChange = (field: FieldName) => {
    setSelectedField(field);
    // Reset filter value whenever the field changes
    setFilterValue(defaultFilterValue);
  };
  const updateFilterValue = (key: string, value: string | number) => {
    setFilterValue({...filterValue, [key]: value });
  };
  const resetControlPanel = () => {
    setSortAscending(false);
    setSelectedField(null);
    setFilterValue(defaultFilterValue);
  };

  return (
    <ControlPanelContext.Provider value={{ sortAscending, selectedField, filterValue, toggleSort, handleSelectedFieldChange, setFilterValue, updateFilterValue, resetControlPanel }}>
      {children}
    </ControlPanelContext.Provider>
  );
};
