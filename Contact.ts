export class Contact {
    constructor(
        public firstname : string, 
        public lastname : string, 
        public address : string, 
        public city : string, 
        public state : string, 
        public zip : string, 
        public phone : string, 
        public email : string
    ){}

    displayContact(){
        console.log(`
            Display Result : 
            Name : ${this.firstname} ${this.lastname}
            Address : ${this.address} ${this.city} ${this.state} ${this.zip}             
            Phone : ${this.phone}             
            Email : ${this.email}
        `);
        
    }
}