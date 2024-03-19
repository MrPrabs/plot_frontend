import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangeContextType {
  selectedDateRange: DateRange;
  setSelectedDateRange: (dateRange: DateRange) => void; // If you're using a setter function directly, this might be more appropriate
}

const defaultDateRange: DateRange = {
  startDate: new Date(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
};

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export const useDateRange = () => {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
};

export const DateRangeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(defaultDateRange);

  const value = { selectedDateRange, setSelectedDateRange };

