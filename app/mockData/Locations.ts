export interface Machine {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  contactNo: number,
  address: string
}

export const MACHINE_LOCATION: Machine[] = [
  { id: 1, name: 'BoltShaker Pimpri',address: 'PBS BoltShaker Trishakti chowk,  Pimpri', latitude: 18.60916304606742, longitude: 73.78810016732783, contactNo: 9728335522 },
  { id: 2, name: 'BoltShaker kalewadi', address: 'Natural BoltShaker, near Tata motors, Kalewadi',latitude: 18.635461383585927, longitude: 73.78776723778806, contactNo: 9928335522 },
  { id: 3, name: 'BoltShaker katraj ',address: 'KBS BoltShaker nanded fata, katraj', latitude: 18.4662096231857, longitude: 73.80424673029513, contactNo: 8228335522 },
  { id: 4, name: 'BoltShaker Punawale',address: 'PWL BoltShaker KoyateVasti, Punawale', latitude: 18.62633460178688, longitude: 73.73893350592584, contactNo: 8728335522 },
  { id: 5, name: 'BoltShaker Tathawade ',address: '4517 Natural BoltShaker machine, Tathawade 291', latitude: 18.630806623076683, longitude: 73.74259404053016, contactNo: 7728335522 }
];
