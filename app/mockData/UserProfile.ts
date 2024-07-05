export type User = {
    id:string,
    name: string,
    email: string,
    contact: string,
    avatar: string
};
export const USER_DATA:User = {
    id:'1',
    name: 'John Doe',
    email: 'johndoe@example.com',
    contact: '123-456-7890',
    avatar: require('../assets/Images/shake.jpg'),
  };
  