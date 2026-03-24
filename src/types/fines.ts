export interface FinesData {
  year: number;
  start_date: string;
  end_date: string;
  jurisdiction: string;
  location: string;
  age_group: string;
  metric: string;
  detection_method: string;
  fines: number;
  arrests: number;
  charges: number;
  month: number;
  month_name: string;
  is_all_locations: string;
  is_unknown_location: string;
  is_all_ages: string;
  is_unknown_age: string;
  metric_label: string;
}