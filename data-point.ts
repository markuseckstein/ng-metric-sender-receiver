
export interface DataPoint {
  name: string;
  value?: number;
  action: 'g' | 'i' | 'd' | 'm' | 't';
  sr?: string;
}

