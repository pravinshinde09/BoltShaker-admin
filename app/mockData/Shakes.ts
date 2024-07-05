
export type MenuItem = {
  id: number;
  name: string;
  price: number;
  image: number;
  details: string;
};

export const SHAKES: MenuItem[] = [
  {
    id: 1,
    name: 'Macaroon Cookies',
    price: 15.3,
    image: require('../assets/Images/shake.jpg'),
    details:
      'This is the temporary text for testing. This info regarding for the ThunderShake app recipe.',
  },
  {
    id: 2,
    name: 'Cortado',
    price: 25.4,
     image: require('../assets/Images/shake.jpg'),
    details:
      'This is the temporary text for testing. This info regarding for the ThunderShake app recipe.',
  },
  {
    id: 3,
    name: 'Irish Coffee',
    price: 10.99,
     image: require('../assets/Images/shake.jpg'),
    details:
      'This is the temporary text for testing. This info regarding for the ThunderShake app recipe.',
  },
  {
    id: 4,
    name: 'Biscotti Cookies',
    price: 7.65,
     image: require('../assets/Images/shake.jpg'),
    details:
      'This is the temporary text for testing. This info regarding for the ThunderShake app recipe.',
  },
  {
    id: 5,
    name: 'Cold brew',
    price: 55,
     image: require('../assets/Images/shake.jpg'),
    details:
      'This is the temporary text for testing. This info regarding for the ThunderShake app recipe.',
  },
  {
    id: 6,
    name: 'Gingerbread Cookies',
    price: 30.15,
     image: require('../assets/Images/shake.jpg'),
    details:
      'This is the temporary text for testing. This info regarding for the ThunderShake app recipe.',
  },
];
