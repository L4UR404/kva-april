export class DataService {
    static getZapakovano() {
        return [
            {
                id: 1,
                name: 'Ukrasno zapakovano',
                price: 50
            },
            {
                id: 2,
                name: 'Bez pakovanja',
                price: 0

            },
            
        ];
    }
    static getZapakovanoById(id: number){
  // Koristimo == ili Number() da izbegnemo problem string vs number
  for (let zp of this.getZapakovano()) {
    if (Number(zp.id) === Number(id)) return zp
  }
  return this.getZapakovano()[0]
}
    
    

}
