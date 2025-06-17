import { Contact } from "./Contact";
import * as readline from "readline";


class AddressBookMain {

    //To store all contacts
    private contacts: Contact[] = []

    constructor() {
        this.displayAddressBook();
    }

    private displayAddressBook(): void {
        console.log("Welcome to Address Book Program");
        // this.addContact();  //addcontact can only add single contact
        this.askToAddContact();
    }

    private rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    private showAllContacts(): void {
        console.log(`You have entered ${this.contacts.length} contact`)
        this.contacts.forEach((contact, index) => {
            console.log(`\n#${index + 1}`);
            contact.displayContact();
        });
    }

    private askToAddContact(): void {
        this.rl.question("Do You want to add a new contact (y/n) : ", (answer) => {
            if (answer === 'Y' || answer === 'y') {
                this.addContact();
                this.askToAddContact();
            }
            else {
                this.showAllContacts();
                this.rl.close();
            }
        });
    }

    private addContact(): void {
        const questions: string[] = [
            "First Name : ",
            "Last Name : ",
            "Address : ",
            "City : ",
            "State : ",
            "Zip : ",
            "Phone :",
            "Email : "
        ]

        //To store all field of a single contact
        const answers: string[] = []

        const ask = (index: number) => {
            if (index === questions.length) {
                //array destructuring
                const [firstname, lastname, address, city, state, zip, phone, email] = answers;

                //creating a contact
                const contact = new Contact(firstname, lastname, address, city, state, zip, phone, email);
                this.contacts.push(contact);
                console.log("contact added succesfully")
                contact.displayContact();
                this.rl.close();
                return;
            }

            this.rl.question(questions[index], (input) => {
                answers.push(input.trim());
                ask(index + 1);
            });
        };
        ask(0);
    }
}


//To Display the welcome message
const addressBook = new AddressBookMain();
