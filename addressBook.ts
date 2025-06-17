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
        this.mainMenu();
    }

    private mainMenu(): void {
        console.log(`
            This is a Main Menu of the program
            Press 1 for Add contact
            Press 2 for Display contact
            Press 3 for Edit contact
            Press 4 for Delete contact
            `);

        this.rl.question("Choose any option from (1-4) : ", (answer) => {
            console.log(answer)
            console.log(typeof answer)
            switch (answer.trim()) {
                case '1':
                    console.log(`You have selected ${answer} for Add contact`)
                    // this.askToAddContact();
                    this.addContact();
                    break;
                case '2':
                    console.log(`You have selected ${answer} for Display contact`)
                    this.showAllContacts();
                    break;
                case '3':
                    console.log(`You have selected ${answer} for Edit contact`)
                    this.editContact();
                    break;
                case '4':
                    console.log(`You have selected ${answer} for Delete contact`)
                    break;

                default:
                    console.log(`invalid option`)
                    break;
            }
        });

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
        this.mainMenu();
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
                this.mainMenu();
                return;
            }

            this.rl.question(questions[index], (input) => {
                answers.push(input.trim());
                ask(index + 1);
            });
        };
        ask(0);
    }

    private editContact(): void {
        this.rl.question("Enter firstname of the person for edit : ", (name) => {
            const findContact = this.contacts.find((person) => person.firstname.toLowerCase() === name.trim().toLowerCase());
            console.log("findContact=  ", findContact);

            if (!findContact) {
                console.log("Contact not found.");
                this.mainMenu();
                return;
            }

            const fields: (keyof Contact)[] = [
                "firstname", "lastname", "address", "city",
                "state", "zip", "phone", "email"
            ];

            const askEdit = (i: number) => {
                if (i === fields.length) {
                    console.log("Contact updated.");
                    findContact.displayContact();
                    this.mainMenu();
                    return;
                }

                const field = fields[i];
                const oldValue = findContact[field];
                this.rl.question(`${field} (${oldValue}) : `, (userInput) => {
                    const trimmedInput = userInput.trim();
                    if (trimmedInput) {
                        (findContact as any)[field] = trimmedInput;
                    }
                    askEdit(i + 1); // Call next question only after current input
                });
            }
            askEdit(0);
        });
    }
}


//To Display the welcome message
const addressBook = new AddressBookMain();
