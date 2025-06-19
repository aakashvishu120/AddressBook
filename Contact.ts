export class Contact {
    constructor(
        public firstname: string,
        public lastname: string,
        public address: string,
        public city: string,
        public state: string,
        public zip: string,
        public phone: string,
        public email: string
    ) { }

    displayContact() {
        console.log(`
            Display Result : 
            First Name : ${this.firstname} 
            Last Name : ${this.lastname}
            Address : ${this.address}
            City : ${this.city}
            State : ${this.state}
            Zip : ${this.zip}             
            Phone : ${this.phone}             
            Email : ${this.email}
        `);

    }
}