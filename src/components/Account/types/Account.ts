export type Account = {
  _id?: string;
  owner: string; //master key
  name: string;
  nectar: number; 
  stable: number;
}