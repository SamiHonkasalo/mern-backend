export class Place {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public location: { lat: number; lng: number },
    public address: string,
    public creator: string
  ) {}
}
